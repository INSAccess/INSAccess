
PROJECT_NAME := backend
up:
	docker-compose up

migrate:
	docker-compose exec django python manage.py migrate

makemigrations:
	docker-compose exec django python manage.py makemigrations

createsuperuser:
	docker-compose exec django python manage.py createsuperuser

dbshell:
	docker-compose exec db psql -U root -d db.postgresql

shell:
	docker-compose exec django sh

build:
	./build_frontend