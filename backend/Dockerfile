FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# # Collect static files at build time
# RUN python manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Start Gunicorn WSGI server
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]
