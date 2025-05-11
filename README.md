# AI-Recipe-Generator-Meal-Planner
The AI Recipe Generator &amp; Meal Planner is a fantastic project that combines food tech, AI, and practical daily utility.

**Backend Setup Guide for New Machine** (Linux/WSL)
1. Prerequisites Installation
sudo apt update
sudo apt install -y python3-pip python3-venv postgresql postgresql-contrib redis-server tesseract-ocr libtesseract-dev

2. Database Setup
sudo -u postgres psql -c "CREATE DATABASE recipe_db;"
sudo -u postgres psql -c "CREATE USER recipe_user WITH PASSWORD 'yourpassword';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE recipe_db TO recipe_user;"

3. Clone Repository
git clone https://github.com/<your-repo>.git
cd recipe-app/backend

4. Python Environment
python3 -m venv venv
source venv/bin/activate (note: after this command make sure you are inside the virtual environment/venv always)
pip install --upgrade pip
pip install -r requirements.txt

5. Environment Configuration
Create .env file: (inside @RECIPEGENERATOR/backend/ directory)

echo "DB_PASSWORD=yourpassword
DEBUG=True
SECRET_KEY=$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')
CELERY_BROKER_URL=redis://localhost:6379/0" > .env

6. Database Migrations
python manange.py makemigrations
python manage.py migrate
python manage.py load_recipes

7. Start Services
In separate terminals:
# Terminal 1 - Django
python manage.py runserver (note: if this command shows the localhost like 127.0.0.1:8000/, Volaaa the backend is configured successfully)

# Terminal 2 - Redis (Optional for now)
redis-server

# Terminal 3 - Celery (Optional for now)
celery -A backend worker -l info --pool=solo

8. Verification
curl http://localhost:8000/api/recipes/search/?q=garlic
#Should return JSON response with recipes

**Troubleshooting Checklist**
# PostgreSQL Connection Issues
sudo service postgresql status
psql -h localhost -U recipe_user -d recipe_db

# Missing Python Dependencies
pip install --force-reinstall -r requirements.txt

# Redis Not Running
sudo systemctl enable redis-server
sudo systemctl start redis-server

# Port Conflicts
sudo lsof -i :8000  # Check Django port
sudo lsof -i :6379  # Check Redis port

# Hala Madrid
