# **Amazon EKS Deployment with GitHub Actions**

This repository demonstrates how to deploy a **Node.js & Express** application to **Amazon EKS** using **GitHub Actions** for CI/CD. The project uses Docker for containerization, Amazon ECR for image storage, and Kubernetes manifests for deployment.

---

## 📝 **Table of Contents**
1. [Project Overview](#-project-overview)  
2. [Tech Stack](#%EF%B8%8F-tech-stack)  
3. [Infrastructure Overview](#-infrastructure-overview)  
4. [GitHub Actions Workflow](#-github-actions-workflow)  

---

## 🌟 **Project Overview**
This project features a Node.js application that returns a simple welcome message. The application is containerized using Docker, stored in Amazon ECR, and deployed to an Amazon EKS cluster using GitHub Actions for CI/CD automation.

---

## 🛠️ **Tech Stack**
- **Node.js & Express**: Web server framework  
- **Docker**: Containerization tool  
- **Amazon ECR (Elastic Container Registry)**: Storage for Docker images  
- **Amazon EKS (Elastic Kubernetes Service)**: Managed Kubernetes cluster  
- **GitHub Actions**: CI/CD pipeline for automating builds and deployments  
- **Kubernetes**: Container orchestration platform  
- **AWS CDK**: Infrastructure as code for AWS resources  

---

## 🏗️ **Infrastructure Overview**
The infrastructure is defined using TypeScript in `infrastructure-stack.ts` and includes:
- **Amazon VPC**: Provides networking for the EKS cluster  
- **Amazon EKS Cluster**: Hosts the containerized application  
- **IAM Roles**: Provide permissions for EKS nodes to pull images from Amazon ECR  
- **Amazon ECR**: Repository for storing Docker images  

---

## 🚀 **GitHub Actions Workflow**

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automates the CI/CD process:
1. **Update Infrastructure**: The workflow first applies any detected infrastructure changes (such as updates to the VPC or EKS configurations) using AWS CDK.  
2. **Build Docker Image**: Once the infrastructure is updated, the workflow builds the Docker image for the Node.js application.  
3. **Push to Amazon ECR**: The newly built Docker image is pushed to Amazon ECR.  
4. **Deploy to Amazon EKS**: Finally, the Kubernetes manifests are applied to update the running pods with the latest image.  

### **Approval Step in the Workflow**
The workflow includes a manual **approval step** after running `cdk diff`, which provides a summary of changes that will be applied to the infrastructure.  
- After approval, the workflow proceeds to update the infrastructure, build and push the Docker image, and deploy the application.  

This ensures that both infrastructure and application updates are reviewed and approved before deployment.

---

