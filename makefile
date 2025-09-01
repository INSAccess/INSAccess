
PROJECT_NAME := backend

#Create the docker
install:
	docker-compose build

# Start and Stop Services
up:
	docker-compose -f docker-compose.dev.yml up

build:
	docker build -t insaccess-backend:latest ./backend
	docker build -t insaccess-frontend:latest ./frontend

down:
	docker-compose down

restart:
	docker-compose down && docker-compose up -d

logs:
	docker-compose logs -f django

ps:
	docker-compose ps

ps_dev:
	docker-compose -f docker-compose.dev.yml ps

# Database Migrations
migrate:
	docker-compose exec django python manage.py migrate

makemigrations:
	docker-compose exec django python manage.py makemigrations

showmigrations:
	docker-compose exec django python manage.py showmigrations

migrate_dev:
	docker-compose -f docker-compose.dev.yml exec django python manage.py migrate

makemigrations_dev:
	docker-compose -f docker-compose.dev.yml exec django python manage.py makemigrations

showmigrations_dev:
	docker-compose -f docker-compose.dev.yml exec django python manage.py showmigrations

# Django User Management
createsuperuser:
	docker-compose exec django python manage.py createsuperuser

changepassword:
	docker-compose exec django python manage.py changepassword $(USER)

# Shell Access
pyshell:
	docker-compose exec django python manage.py shell

dbshell:
	docker-compose exec db psql -U root -d db.postgresql

shell:
	docker-compose exec django sh

# Static Files
collectstatic:
	docker-compose exec django python manage.py collectstatic --noinput

# Running Tests
test:
	docker-compose exec django python manage.py test core.tests

# Cleanup
clean:
	docker-compose down -v
	docker volume prune -f
	docker-compose up -d --build

resetdb:
	docker-compose down -v
	docker-compose up -d db
	sleep 5  # Give the database time to initialize
	docker-compose up -d django  # Make sure the web service is started
	sleep 5  # Wait for the web service to fully start
	docker-compose exec django python manage.py migrate

