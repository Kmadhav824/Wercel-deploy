# 🚀 wercel-deploy — Deployment Service

The **wercel-deploy** service is responsible for running build commands on the project for publishing built applications and making them available for production hosting.

It acts as the **build and deployment layer** of the Wercel platform by receiving build artifacts and preparing them for serving through the request handler.

This service completes the deployment pipeline after build processing.

---

## 🚀 Overview

The deployment service handles:


It manages deployment artifacts, version handling, and release preparation.

---

## 🎯 Responsibilities

- Receive the Project files from R2 object store
- Build the project
- Upload artifacts ready for serving

---

## ⚙️ How It Works

### Deployment Workflow

1. Receives Project files and build
2. Processes production artifacts
3. Publishes deployment package
4. Stores deployment metadata
5. Makes deployment available to request handler


---

## 🏗 System Role

This service acts as the **build release layer** of the system.

It separates:

- build computation
- production deployment
- request serving

This ensures reliable and maintainable deployment workflows.

---

## ✨ Key Features

- Deployment artifact management
- Production release pipeline
- Deployment lifecycle handling
- Versioned deployments
- Independent deployment workflow

---

## 🔒 Design Considerations

### Reliability
Ensures deployments are properly published before serving.

### Version Management
Supports deployment tracking and potential rollback.

### Scalability
Can handle multiple deployments independently.

### Separation of Concerns
Deployment logic isolated from build and serving layers.

---

## 🧩 Tech Stack

- **Runtime:** Node.js
- **Storage:** Cloudflare R2
- **Architecture:** Deployment Service
- **Communication:** REST APIs

---

## 🔗 Related Services

- wercel-clone: https://github.com/Kmadhav824/wercel
- Fetch Service: https://github.com/Kmadhav824/wercel-fetch
- Build Service: https://github.com/Kmadhav824/wercel-build
- Request Handler: https://github.com/Kmadhav824/wercel-request-handler
- System Bundle: https://github.com/Kmadhav824/wercel-bundle

---

## 🎯 Learning Goals

- Deployment pipelines
- Release engineering
- Artifact management
- CI/CD workflow design
- Production system architecture

---

## 👨‍💻 Author

Madhav Kumar  
https://github.com/Kmadhav824
