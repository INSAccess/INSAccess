# InsAccess

<div align="center">

**A modern web app for INSA Rouen Normandie students**

*Simplifying class schedules and empowering student associations*

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Django](https://img.shields.io/badge/django-4.x-green)
![React](https://img.shields.io/badge/react-18.x-blue)
![Docker](https://img.shields.io/badge/docker-compose-blue)

</div>

---

## Overview

InsAccess is a web application designed specifically for INSA Rouen Normandie, providing a clean and intuitive class agenda similar to [Agendas INSA Rouen](https://agendas.insa-rouen.fr). What sets InsAccess apart is its focus on empowering student associations and clubs to add custom events, along with providing essential student utilities.

This project serves as both a practical alternative for students and an exciting exploration into modern web development.

---

## Table of Contents

- [Quick Start](#-quick-start)
- [Documentation](#-documentation)
- [Development](#️-development)
- [Architecture](#️-architecture)
- [Utility Scripts](#️-utility-scripts)
- [Database Models](#-database-models)
- [Production](#-production)

---

## Quick Start <div id='-quick-start'/>

### Backend Setup

1. **Install Docker Compose**
   ```bash
   # Follow the official guide
   https://docs.docker.com/compose/install/
   ```

2. **Initialize the backend**
   ```bash
   cd backend
   make install
   ```

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Launch all services**
   ```bash
   make up
   ```

---

## Documentation <div id='-documentation'/>

### Backend Documentation
> Coming soon - comprehensive API documentation

### Frontend Documentation
Generate and view the frontend documentation:

```bash
cd frontend
npm run docs
# Open docs/index.html in your browser
```

---

## Development <div id='-development'/>

### Essential Commands

| Command | Description |
|---------|-------------|
| `make up` | Launch all services (db, django, react) |
| `make dbshell` | Access the database |
| `make migrate` | Apply database migrations |
| `make createsuperuser` | Create a superuser account |

### CAS Server Setup

Launch the dummy CAS server for development:

```bash
cd cas-server
npm start
```

> 💡 User templates for the CAS server are located at the top of `server.js`

### Database Migrations

When you modify Django models:

```bash
# With services running
make migrate
```

### Creating Superusers

There are three methods available : 

- **Shell**: `make createsuperuser` (if user doesn't exist)
- **Admin Interface**: Use the Django admin panel and go to the User section (check *users* at `/admin/default`)
- **Database**: Directly modify values in the database

---

## Architecture <div id='-architecture'/>

### Project Structure

```bash
# View the complete structure
tree --dirsfirst -F -I "__init__.py|*.svg|*.png|docs|build|__pycache__|.env|node_modules|.git|node_modules|venv"
```

### Backend Architecture

```
backend/
├── config/                  # Django core configuration
│   ├── settings.py          # Main settings
│   ├── urls.py              # Global URL config
│   ├── insa_config.json     # Custom config
│   └── local_settings.py    # Local settings (ignored by git)
│
├── core/                   # Main Django app
│   ├── migrations/         # Database migrations
│   ├── templates/          # HTML templates
│   ├── urls/               # Modular URL configurations
│   │   ├── api_urls.py     # API endpoints
│   │   ├── auth_urls.py    # Authentication endpoints
│   │   └── ics_urls.py     # Calendar endpoints
│   ├── views/              # Request handlers
│   │   ├── api_views.py    # API views
│   │   ├── auth_views.py   # Auth views
│   │   └── ics_views.py    # Calendar views
│   ├── utils/              # Utility scripts
│   │   ├── db_insertion.py # Database utilities
│   │   └── fetch.py        # Data fetching utilities
│   ├── models.py           # Database models
│   ├── serializers.py      # DRF serializers
│   └── admin.py            # Admin interface
│
└── logs/                   # Application logs
```

### Frontend Architecture

```
frontend/
├── src/                    # Source code
│   ├── components/         # React components
│   │   ├── Events/         # Event-related components
│   │   └── Pages/          # Page components
│   ├── contexts/           # React contexts
│   ├── images/             # Static images
│   └── utils/              # Utility functions
│       ├── Constants.jsx   # API routes & constants
│       ├── EventUtils.jsx  # Event display utilities
│       ├── Day.jsx         # Date management
│       └── RandomUtils.jsx # General utilities
│
├── public/                 # Static assets
├── docs/                   # Generated documentation
└── build/                  # Compiled output
```

---

## Utility Scripts <div id='-utility-scripts'/>

### Data Fetching (`fetch.py`)

**Import usage:**
```python
from utils.fetch import get_data_calendar_data, fetch_entire_year
```

**Command line usage:**
```bash
python fetch.py <current_year> <department> <department_year> <date> <period_of_time>
```

**Parameters:**
- `current_year`: Scholar year start (2024 for 2024-2025)
- `department`: Department code ("ITI", "GM", "PERF-II", etc.)
- `department_year`: Year in department (1, 2, 3, 4, 5)
- `date`: Target date (format: YYYYMMDD)
- `period_of_time`: Fetch period (day, week, month)

### Database Insertion (`db_insertion.py`)

```python
from utils.db_insertion import insert_list_records, insert_record_in_db
```

---

## Database Models <div id='-database-models'/>

### User Management
- **UserProfile**: Extended user information
- **UserLinkTD**: User-TD group relationships

### Event System
- **Event**: Abstract base for all events
- **InsaClass**: INSA classes and custom events
- **InsaEvenement**: Association events

### Organizations
- **Association**: Student associations
- **AssociationPublisher**: Event publishing permissions
- **EnumType/EnumSector/EnumColor**: Association attributes

### Infrastructure
- **GroupTD**: TD groups
- **Department**: Academic departments
- **Teacher**: Faculty information
- **Room**: Classrooms
- **EvenementRoom**: Event-specific rooms

### Relationships
Many-to-many relationship models:
- **EvenementLinkEventRoom**
- **ClassLinkTD**
- **ClassLinkRoom**
- **ClassLinkTeacher**
- **ClassLinkDepart**

---

## Production <div id='-production'/>

> Production deployment guide coming soon!

### Association publishers

In order to enable an user to create evenements as an association, there are a few steps to do as an administrator.

> Everything explained in the next steps will be executed in the tabs of the admin panel of django 

1) Beforehand, create an adequate type and sector in the enum tab.

2) Create the desired association with a custom color.

3) Create an association publisher by linking an association and a user.

> ⚠️ **Important**: The user must have been connected at least once to the app for his userprofile to be created. Otherwise you won't be able to select the user.