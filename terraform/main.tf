resource "google_compute_network" "vpc_network" {
  name                    = "gke-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "gke_subnet" {
  name          = "gke-subnet"
  ip_cidr_range = "10.0.0.0/16"
  region        = var.region
  network       = google_compute_network.vpc_network.id

  secondary_ip_range {
    range_name    = "gke-pods-range"
    ip_cidr_range = "10.1.0.0/16"
  }

  secondary_ip_range {
    range_name    = "gke-services-range"
    ip_cidr_range = "10.2.0.0/20"
  }
}




module "gke" {
  source  = "terraform-google-modules/kubernetes-engine/google"
  version = "29.0.0"

  project_id        = var.project_id
  name              = var.cluster_name
  region            = var.region
  network           = google_compute_network.vpc_network.name
  subnetwork        = google_compute_subnetwork.gke_subnet.name
  ip_range_pods     = "gke-pods-range"
  ip_range_services = "gke-services-range"
  deletion_protection = false
  node_pools = [
    {
      name         = "default-node-pool"
      machine_type = "e2-medium"
      node_count   = 1
    }
  ]
}

data "google_client_config" "default" {}

provider "kubernetes" {
  host                   = module.gke.endpoint
  cluster_ca_certificate = base64decode(module.gke.ca_certificate)
  token                  = data.google_client_config.default.access_token
}

resource "kubernetes_deployment" "go_ethereum" {
  metadata {
    name = "go-ethereum-devnet"
    labels = {
      app = "go-ethereum"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "go-ethereum"
      }
    }

    template {
      metadata {
        labels = {
          app = "go-ethereum"
        }
      }

      spec {
        container {
          name  = "go-ethereum"
          image = "ghcr.io/radost5454/go-ethereum:devnet-with-contracts"
          command = ["/bin/sh"]
          args = [
            "-c",
            "geth --dev --dev.period 1 --datadir /tmp/devdatadir --http --http.addr 0.0.0.0 --http.api eth,net,web3,personal --http.port 8545 --allow-insecure-unlock"
          ]

          port {
            container_port = 8545
          }

          volume_mount {
            mount_path = "/tmp/devdatadir"
            name       = "devdata"
          }
        }

        volume {
          name = "devdata"
          empty_dir {}
        }
      }
    }
  }
}


resource "kubernetes_service" "go_ethereum" {
  metadata {
    name = "go-ethereum-service"
  }

  spec {
    selector = {
      app = "go-ethereum"
    }

    port {
      port        = 8545
      target_port = 8545
    }

    type = "LoadBalancer"
  }
}

