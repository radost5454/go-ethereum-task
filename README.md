# Go Ethereum Project

## CI/CD Pipeline

Our project uses GitHub Actions for continuous integration and deployment with two main workflows:

1. **Build and Push Docker Image (Triggered by CI:Build label)**
   - Builds a new Docker image of the project
   - Uploads the image to the container registry

2. **Deploy Contracts to Devnet (Triggered by CI:Deploy label)**
   - Deploys smart contracts to the development network
   - Sets up necessary infrastructure
   - Configures network parameters
   - Verifies contract deployment

To trigger these workflows:
- Add the label `CI:Build` to a PR to build and push the Docker image
- Add the label `CI:Deploy` to deploy to devnet

## Local Development with Docker Compose

To run the project locally using Docker Compose:

1. Ensure you have Docker and Docker Compose installed
2. Clone the repository
3. Run the following commands:

```bash
# Build and start the containers
docker-compose up --build

# To run in detached mode
docker-compose up -d

# To stop the containers
docker-compose down
```

The docker-compose file includes:
- Geth node
- Development environment
- Required dependencies

Access the application at `http://localhost:8545` (default port)

## Terraform Setup

To set up the infrastructure using Terraform:

1. **Initial Setup**
   - Fork this repository to your GitHub account
   - Clone your forked repository
   - Make sure you have your own GCP project and credentials

2. **Prerequisites**
   - Terraform v1.0.0 or later
   - Google Cloud SDK installed
   - Access to Google Cloud Platform
   - Your own GCP project (create one if you don't have it)

3. **Initial GCP Setup**
   ```bash
   # Login to Google Cloud
   gcloud auth login

   # Set your project
   gcloud config set project YOUR_PROJECT_ID

   # Enable required APIs
   gcloud services enable \
       compute.googleapis.com \
       container.googleapis.com \
       iam.googleapis.com \
       cloudresourcemanager.googleapis.com \
       --project=YOUR_PROJECT_ID
   ```

4. **Required Variables**
   Create a `terraform.tfvars` file with the following variables:
   ```hcl
   github_token = "your_github_token"        # Your personal GitHub token
   github_username = "your_github_username"  # Your GitHub username
   project_id = "your_gcp_project_id"        # Your GCP project ID
   ```

   > **Note**: For production environments, it's recommended to use HashiCorp Vault for managing sensitive credentials instead of storing them directly in terraform.tfvars. Vault provides secure storage and dynamic secrets management.

5. **Initial Setup**
   ```bash
   # Initialize Terraform
   terraform init

   # Review the planned changes
   terraform plan

   # Apply the changes
   terraform apply
   ```

6. **Verify Setup**
   ```bash
   # Get cluster credentials
   gcloud container clusters get-credentials geth-cluster --region us-central1 --project=YOUR_PROJECT_ID

   # Verify cluster access
   kubectl get nodes
   ```

7. **Important Notes**
   - Always review the plan before applying changes
   - Keep your state file secure
   - Follow the principle of least privilege for IAM roles
   - Make sure all required APIs are enabled in your GCP project
   - The project ID must be unique across all of Google Cloud
   - Use your own credentials and project - do not use the original repository's credentials
   - Make sure to update the GitHub token and username in your forked repository's secrets
   - For production environments, store the Terraform state file in a secure S3 bucket with versioning enabled

For more detailed information about the infrastructure setup, refer to the `terraform/` directory.
