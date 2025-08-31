FROM python:3.11-slim

WORKDIR /app

# Copier requirements depuis le dossier backend
COPY ./requirements.txt .

# Installer les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code backend
COPY . .

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]