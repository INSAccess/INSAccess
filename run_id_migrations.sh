#!/bin/bash
docker-compose exec django python manage.py migrate core 0012
docker-compose exec django python manage.py populate_ids
docker-compose exec django python manage.py migrate core 0013
docker-compose exec django python manage.py migrate core 0014
docker-compose exec django python manage.py migrate core 0015 --fake
