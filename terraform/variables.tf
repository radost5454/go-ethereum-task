variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "region" {
  description = "The GCP region"
  type        = string
  default     = "us-central1"
}

variable "cluster_name" {
  description = "The name of the GKE cluster"
  type        = string
  default     = "go-ethereum-devnet-cluster"
}

variable "github_username" {
  description = "GitHub username for container registry authentication"
  type        = string
}

variable "github_token" {
  description = "GitHub personal access token for container registry authentication"
  type        = string
  sensitive   = true
}

