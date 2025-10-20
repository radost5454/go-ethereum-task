# DevOps Infrastructure Automation Task — GCP Flask Stack

## Overview

This project demonstrates an end-to-end **Infrastructure as Code (IaC)** deployment using **Terraform**, **Docker**, and **GitHub Actions**, hosted on **Google Cloud Platform (GCP)**.

It provisions a **three-tier web application stack** consisting of:
- **NGINX Load Balancer**
- **Flask Web Application**
- **PostgreSQL Database**

Each component runs in its own **Compute Engine instance** built on **Container-Optimized OS (Container-Optimized OS)** for security, performance, and self-healing capability.

---

##  Repository Structure

```
.
├── .git-crypt/
│   └── keys/
│       └── default/
│           └── <GPG key files>
├── .github/
│   └── workflows/
│       ├── docker-build.yml
│       └── terraform.yml
├── terraform/
│   ├── database_server.tf
│   ├── load_balancer.tf
│   ├── network.tf
│   ├── provider.tf
│   ├── variables.tf
│   ├── web_server.tf
│   ├── terraform.tfstate
│   └── terraform.tfstate.backup
├── .gitattributes
├── .gitignore
├── Dockerfile
├── requirements.txt
├── web_app.py
├── git-crypt-key.b64
└── README.md
```

---

##  CI/CD Workflows

###  Build and Push Docker Image  
**File:** `.github/workflows/docker-build.yml`  
**Trigger:** When a Pull Request is merged and labeled `CI:Build`

This workflow builds the Flask Docker image and pushes it to GitHub Container Registry (`ghcr.io/<username>/gcp-flask-app`) with both `:latest` and commit-SHA tags.

---

### Terraform Deployment  
**File:** `.github/workflows/terraform.yml`  
**Trigger:** Manual workflow dispatch  
**Inputs:** `plan`, `apply`, or `destroy`

This workflow:
- Unlocks encrypted state with **git-crypt**
- Authenticates to GCP via `GOOGLE_CREDENTIALS`
- Runs Terraform plan/apply/destroy
- Commits updated encrypted state files back to GitHub

---

## Running Terraform Locally or via CI/CD

Terraform can be executed in two ways:

### From GitHub Actions (CI/CD)

Run it from the **Actions** tab:
1. Select **Terraform Deploy**  
2. Click **Run workflow**  
3. Choose one of the options:
   - `plan` → Preview changes  
   - `apply` → Deploy infrastructure  
   - `destroy` → Tear down resources  

---

### From Local Machine

1. Update your branch:
   ```bash
   git checkout master
   git pull
   ```

2. Unlock **git-crypt** to access Terraform state:
   ```bash
   git-crypt unlock
   ```

3. Move to the Terraform directory:
   ```bash
   cd terraform
   ```

4. Either create a **terraform.tfvars** file:
   ```hcl
   project_id  = ""
   region      = ""
   db_user     = ""
   db_password = ""
   db_name     = ""
   ```
   or export environment variables:
   ```bash
   export TF_VAR_project_id=<YOUR_PROJECT_ID>
   export TF_VAR_region=<YOUR_REGION>
   export TF_VAR_db_user=<USERNAME>
   export TF_VAR_db_password=<PASSWORD>
   export TF_VAR_db_name=<DB_NAME>
   ```

5. Authenticate to GCP:
   ```bash
   gcloud auth login
   ```

6. Run Terraform:
   ```bash
   terraform init
   terraform plan
   terraform apply
   terraform destroy
   ```

---

## git-crypt Integration

Sensitive Terraform state files are encrypted with **git-crypt** to ensure confidentiality, even in public repositories.

### Adding Users or Creating a Collaboration Key

Either:
```bash
git-crypt add-gpg-user your_pgp_email@something.com
```
or (if the collaborator’s key isn’t imported yet):

1. **Obtain the user’s public key** (`.asc`, `.gpg`, or `.txt` file)  
2. **Import the key**:
   ```bash
   gpg --import /path/to/filename.asc
   ```
3. **Set trust level**:
   ```bash
   gpg --edit-key your_pgp_email@something.com
   gpg> trust
   (choose 5 = ultimate)
   gpg> q
   ```
4. **Add user to git-crypt**:
   ```bash
   git-crypt add-gpg-user --trusted your_pgp_email@something.com
   ```
5. **Commit and push**:
   ```bash
   git add .git-crypt
   git commit -m "Add new git-crypt user"
   git push
   ```

  **Reference:**  
[git-crypt Official Documentation and Example Repository](https://github.com/OpeningDesign/encryption-test/tree/master)

---

## Failover and Self-Healing Strategy

This infrastructure implements **multi-layer resilience and self-healing** using GCP instance scheduling and container-level restart policies.  

---

### VM-Level Self-Healing (Compute Engine)

Each Compute Engine VM (`web_server`, `load_balancer`, `postgres_database`) includes the following configuration:

```hcl
scheduling {
  automatic_restart   = true
  on_host_maintenance = "MIGRATE"
}
```

- `automatic_restart = true`  
  → Automatically restarts the VM if it crashes or stops unexpectedly.  
- `on_host_maintenance = "MIGRATE"`  
  → During GCP host maintenance, the instance live-migrates to another host without downtime.  

> **By default**, both of these properties are set to `true` in GCP instances, meaning that all newly created instances automatically benefit from these behaviors even if you don’t explicitly configure them.

  **Official Terraform Documentation:**  
[google_compute_instance — Scheduling block](https://registry.terraform.io/providers/hashicorp/google/6.50.0/docs/resources/compute_instance)

This ensures that if a VM or the underlying physical host fails, the instance is either restarted or seamlessly migrated with no manual action required.

---

### Container-Level Resilience (Container-Optimized OS)

Each Compute Engine VM runs Docker containers using **Container-Optimized OS (Container-Optimized OS)**.  
Container-Optimized OS provides automatic container restarts and lightweight isolation.

All containers (Flask app, PostgreSQL, NGINX) include:
```yaml
restartPolicy: Always
```

This ensures:
- Containers automatically restart if the application process crashes or exits unexpectedly.
- Flask containers define a Docker `HEALTHCHECK` that probes the `/healthz` endpoint every 30 seconds.
- If the health check fails repeatedly, Container-Optimized OS restarts the container automatically.

Example from Dockerfile:
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD curl -fsS http://localhost:${PORT}/healthz || exit 1
```



---

### Summary of the Self-Healing Mechanism

1. **Container Health** — `restartPolicy: Always` ensures the process always runs.  
2. **VM Reliability** — GCP’s built-in auto-restart and live-migration provide hardware resilience.  
3. **Layered Recovery** — Even if the VM fails, the container restarts once it’s back online.  
4. **Continuous Availability** — The load balancer remains online and restores service within seconds.

This combination provides robust, production-like **resiliency** using only **free-tier GCP resources** and open-source tooling.

---

### Testing the Deployment

After running `terraform apply`, verify deployment status:

```bash
gcloud compute instances list
```

Then test your endpoints:

```bash
curl http://<LOAD_BALANCER_IP>/
curl http://<LOAD_BALANCER_IP>/healthz
curl http://<LOAD_BALANCER_IP>/db-check
```

Expected responses:
- `/` → `{"message":"The health check of the app is working which is with /"}`
- `/healthz` → `ok of the healthz check`
- `/db-check` → PostgreSQL version output
