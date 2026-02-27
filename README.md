# IDS Application Service / Сервис ИНД заявок

This project provides a web‑based service for managing IDS applications. It allows users to create, submit, and track applications with flexible forms, attach files, and receive status updates. Administrators can review applications, change statuses, and leave comments. The application is built to be easily deployable on‑premises using Docker.

## Features

- User registration and authentication (JWT).
- Dynamic application forms configured via a simple JavaScript file (fields based on the "Интегрированный набор данных" template).
- File uploads (documents) stored on‑premises.
- User dashboard to list, view, and submit applications.
- Admin dashboard to view all applications and update their status.
- Admin interface to manage dataset metadata (according to the provided Excel template).
- Russian language interface (can be switched to English by modifying the code).
- Fully containerised with Docker and Docker Compose.

## Technology Stack

- **Backend:** Node.js + Express (TypeScript)
- **Database:** PostgreSQL (with JSONB for flexible application data)
- **Frontend:** React (bootstrapped with Create React App)
- **Reverse Proxy:** Nginx (serves frontend and proxies API requests)
- **File Storage:** Local on‑premises directory (mounted into containers)
- **Containerisation:** Docker, Docker Compose

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) (version 20.10+)
- [Docker Compose](https://docs.docker.com/compose/) (usually included with Docker Desktop)
- [Git](https://git-scm.com/) (optional, for cloning)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/user-app-service.git
cd user-app-service
```
