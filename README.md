# CollabSpace - Real-time Collaboration Platform

A full-stack premium real-time collaboration platform where multiple users can work on shared documents simultaneously. Built for seamless cross-device workflows.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, STOMP.js, SockJS |
| Backend | Java 17, Spring Boot 3.2, Spring Security, Spring WebSocket |
| ORM | Hibernate (Spring Data JPA) |
| Database | H2 (development) / Oracle (production) |
| Auth | JWT (JSON Web Tokens) with BCrypt hashing |
| Web Services | REST API + WebSocket (STOMP over SockJS) |

## Features

- **User Authentication** — Register and login with JWT-based security
- **Document Management** — Create, edit, save, and delete documents
- **Real-time Collaboration** — Multiple users edit the same document simultaneously via WebSocket
- **Version History** — Every save creates a version snapshot; revert to any previous version
- **Import & Export** — Directly import local text files and export/download real-time document data
- **Collaborator Search** — Live-search the database for platform users and instantly invite them directly inside the platform
- **Live Presence** — See who is currently editing this document

## Project Structure

```
├── collab-platform-backend/        # Spring Boot backend
│   ├── src/main/java/com/collabplatform/
│   │   ├── config/                 # Security, WebSocket, CORS configs
│   │   ├── controller/             # REST + WebSocket controllers
│   │   ├── dto/                    # Request/Response data objects
│   │   ├── model/                  # JPA entity classes
│   │   ├── repository/             # Spring Data repositories
│   │   ├── security/               # JWT token provider and filter
│   │   └── service/                # Business logic layer
│   └── src/main/resources/
│       ├── application.properties          # H2 config (default)
│       └── application-oracle.properties   # Oracle config
│
├── collab-platform-frontend/       # React frontend
│   ├── src/
│   │   ├── api/                    # Axios HTTP client
│   │   ├── components/             # Reusable UI components
│   │   ├── context/                # Auth context provider
│   │   ├── pages/                  # Application pages
│   │   └── services/               # API and WebSocket services
│   ├── index.html
│   └── vite.config.js
```

## Prerequisites

- Java 17 or higher
- Maven 3.8+
- Node.js 18+
- npm 9+

## Getting Started

### Quick Start (Windows)

We have provided two shortcut scripts in the root directory for easy launching:
```cmd
.\start-backend.cmd
.\start-frontend.cmd
```

### Manual Start 

#### Backend

```bash
cd collab-platform-backend
mvn clean install
mvn spring-boot:run
```

The backend starts on http://localhost:8081

H2 Console is available at http://localhost:8081/h2-console (username: sa, no password)

#### Frontend

```bash
cd collab-platform-frontend
npm install
npm run dev
```

The frontend starts on http://localhost:3000

### Switching to Oracle Database

1. Install Oracle XE and create a user/schema
2. Run the backend with the Oracle profile:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=oracle
```

3. Update credentials in `application-oracle.properties`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login and receive JWT |
| GET | /api/documents | List all user documents |
| POST | /api/documents | Create a new document |
| GET | /api/documents/{id} | Get document by ID |
| PUT | /api/documents/{id} | Update document content |
| DELETE | /api/documents/{id} | Delete a document |
| GET | /api/documents/{id}/versions | Get version history |
| POST | /api/documents/{id}/revert/{versionId} | Revert to a version |
| POST | /api/documents/{id}/collaborators | Add collaborator |
| GET | /api/documents/{id}/collaborators | List collaborators |
| GET | /api/users/search?q={query} | Live search for platform users |

## WebSocket Endpoints

| Direction | Destination | Description |
|-----------|------------|-------------|
| Client → Server | /app/document.edit.{docId} | Send document edit |
| Server → Client | /topic/document.{docId} | Receive real-time updates |

## Database Schema

The application uses 4 tables:
- **USERS** — User accounts with hashed passwords
- **DOCUMENTS** — Document content with ownership
- **DOCUMENT_VERSIONS** — Version history snapshots
- **COLLABORATORS** — Document sharing relationships
