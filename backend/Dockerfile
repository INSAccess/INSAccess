# Step 1: Use an official Python runtime as a parent image
FROM python:3.11

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy the current directory contents into the container at /app
COPY . /app/

# Step 4: Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Step 5: Expose port (default Django runs on 8000)
EXPOSE 8000

# Step 6: Run the Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
