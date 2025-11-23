# TBank Hackathon Project

## Local Development

### Using Docker Compose (Recommended)

1. **Build and start the services:**
   ```bash
   docker-compose up --build
   ```

2. **Create a superuser (first time only):**
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

3. **Access the application:**
   - Backend API: http://localhost:8000
   - Admin panel: http://localhost:8000/admin

4. **Stop the services:**
   ```bash
   docker-compose down
   ```

### Local Development without Docker

1. Create and activate virtual environment
2. Install dependencies: `pip install -r backend/requirements.txt`
3. Copy `backend/.env.example` to `backend/.env` and configure
4. Run migrations: `python manage.py migrate`
5. Run server: `python manage.py runserver`

## Database Information

- **SQLite (db.sqlite3)**: Should NOT be committed to Git (already in .gitignore)
- **Production**: Uses PostgreSQL via Docker Compose
- Database is automatically created and migrated when using docker-compose

## Deployment Options

### Option 1: Deploy with Docker
1. Use a service like Railway, Render, or DigitalOcean App Platform
2. Connect your GitHub repo
3. Set environment variables in the platform
4. The platform will use docker-compose.yml automatically

### Option 2: Deploy to Heroku/Railway
1. Add Procfile for web process
2. Set environment variables (SECRET_KEY, DATABASE_URL)
3. Push to GitHub and connect to deployment platform

### Option 3: VPS Deployment
1. Clone repo on server
2. Run `docker-compose up -d` for production
3. Set up nginx as reverse proxy
4. Configure domain and SSL

## Environment Variables for Production

Set these in your deployment platform:
- `SECRET_KEY`: Generate a new secure key
- `DEBUG`: Set to `0`
- `ALLOWED_HOSTS`: Your domain (e.g., `yourdomain.com`)
- Database credentials will be auto-configured by docker-compose