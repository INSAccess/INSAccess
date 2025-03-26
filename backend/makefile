
PROJECT_NAME := backend

# Start and Stop Services
up:
	docker-compose up -d

down:
	docker-compose down

restart:
	docker-compose down && docker-compose up -d --build
logs:
	docker-compose logs -f web

# Database Migrations
migrate:
	docker-compose exec web python manage.py migrate

makemigrations:
	docker-compose exec web python manage.py makemigrations

showmigrations:
	docker-compose exec web python manage.py showmigrations

# Django User Management
createsuperuser:
	docker-compose exec web python manage.py createsuperuser

changepassword:
	docker-compose exec web python manage.py changepassword $(USER)

# Shell Access
pyshell:
	docker-compose exec web python manage.py shell

dbshell:
	docker-compose exec db psql -U root -d db.postgresql

shell:
	docker-compose exec web sh

# Static Files
collectstatic:
	docker-compose exec web python manage.py collectstatic --noinput

# Running Tests
test:
	docker-compose exec web python manage.py test

# Cleanup
clean:
	docker-compose down -v
	docker volume prune -f
	docker-compose up -d --build

resetdb:
	docker-compose down -v
	docker-compose up -d db
	sleep 5  # Give the database time to initialize
	docker-compose up -d web  # Make sure the web service is started
	sleep 10  # Wait for the web service to fully start
	docker-compose exec web python manage.py migrate

