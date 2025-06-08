output "kubeconfig_command" {
  value = "gcloud container clusters get-credentials ${var.cluster_name} --region ${var.region}"
}

output "go_ethereum_service_ip" {
  value = kubernetes_service.go_ethereum.status[0].load_balancer[0].ingress[0].ip
}
