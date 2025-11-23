# T-Bank Hackathon Project

## 🚀 Quick Start with Docker

This project consists of a Django backend and React frontend, fully containerized for easy deployment.

### Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

### Running the Application

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd tbank-hackathone
   ```

2. **Build and run the containers**:
   ```bash
   docker compose up --build
   ```

3. **Access the application**:
   - **Frontend**: http://localhost
   - **Backend API**: http://localhost:8000
   - **Django Admin**: http://localhost:8000/admin

### Container Management

**Stop the containers**:
```bash
docker compose down
```

**Stop and remove volumes** (resets database):
```bash
docker compose down -v
```

**View logs**:
```bash
docker compose logs -f
```

**Rebuild after changes**:
```bash
docker compose up --build
```

## 📁 Project Structure

```
tbank-hackathone/
├── backend/              # Django REST API
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── requirements.txt
│   └── ...
├── frontend/             # React + Vite application
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── nginx.conf
│   └── ...
└── docker-compose.yml    # Docker Compose configuration
```

## 🔧 Configuration

### Backend (Django)
- Runs on port 8000
- Uses SQLite database (persisted via volume)
- Media files stored in `backend/media` directory
- CORS enabled for all origins

### Frontend (React + Nginx)
- Runs on port 80
- Nginx serves static files and proxies API requests
- API requests to `/api`, `/media`, and `/admin` are forwarded to backend

## 🛠️ Development

### Loading Test Data

After starting the containers, you can load test data:

```bash
docker compose exec backend python manage.py loaddata <fixture-file>
```

Or run the load_test_data script if available:
```bash
docker compose exec backend python load_test_data.py
```

### Creating Django Superuser

```bash
docker compose exec backend python manage.py createsuperuser
```

### Running Migrations

```bash
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate
```

## 📝 Notes

- The database file `db.sqlite3` is persisted using Docker volumes
- Media files are also persisted in the `backend/media` directory
- First startup may take a few minutes to build the images
- The backend automatically runs migrations on startup

## 🐛 Troubleshooting

**Port already in use**:
If port 80 or 8000 is already in use, modify the ports in `docker-compose.yml`:
```yaml
ports:
  - "3000:80"  # Frontend on port 3000
  - "8001:8000"  # Backend on port 8001
```

**Permission issues**:
Ensure Docker has the necessary permissions to mount volumes.

**Build failures**:
Try cleaning Docker cache:
```bash
docker compose down
docker system prune -a
docker compose up --build
```