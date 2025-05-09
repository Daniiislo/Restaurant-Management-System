<div align="center">

# **Restaurant Management System**

</div>

## **Table of Contents**

- [Overview](#overview)
- [Core Features](#core-features)
- [Technologies Used](#technologies-used)
- [System Requirements](#system-requirements)
- [Database Setup](#database-setup)
- [Backend Setup](#backend-setup)
- [Import data to database](#import-data-to-database)
- [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Additional Commands](#additional-commands)
- [Login to the system as admin](#login-to-the-system-as-admin)
- [References](#references)

## **Overview**

Restaurant Management System is a comprehensive restaurant management solution developed using React for the Frontend and Django REST Framework for the Backend. The system provides essential management features for restaurants, from table reservations and menu management to revenue reports and employee management.

## Core Features

### Administrator (Admin)

- Manage restaurant information
- Manage menu (add, edit, delete food items and categories)
- Manage promotions
- Manage employees and departments
- Manage tables
- View sales reports (by day, month, quarter, year)

### Staff (Employee)

- Process reservations
- Manage invoices
- Print invoices

### Customer

- View menu
- Make online reservations
- View promotion information
- Rate service
- Manage reservation history

## Technologies Used

### Frontend

- React.js
- React Router DOM
- Axios
- Chart.js
- Font Awesome
- JWT Authentication

### Backend

- Django REST Framework
- PostgreSQL
- JWT Authentication
- Email Service (SMTP)
- AWS S3

## **System Requirements**

**1. Install Python 3.8+:**

- Windows: Download from [python.org](https://www.python.org/downloads/)
- Linux: `sudo apt install python3`
- Mac: `brew install python3`

**2. Install Node.js 14+:**

- Download from [nodejs.org](https://nodejs.org/)
- Verify installation: `node --version`

**3. Install pipenv:**

```bash
pip install pipenv
```

**4. Verify npm installation (comes with Node.js):**

```bash
npm --version
```

## **Database Setup**

**Create a MySQL database**

**Example:**

```bash
CREATE DATABASE restaurant;
```

**Note:** If you don't use MySQL, you can use other databases like `PostgreSQL`, `SQLite`, etc. Just make sure to setup the `ENGINE` in `.env` file accordingly.

**Example:**

```bash
ENGINE = 'django.db.backends.mysql'

or

ENGINE = 'django.db.backends.postgresql'
```

## **Backend Setup**

**1. At folder `Intro2SE`, navigate to Backend directory:**

```bash
cd .\src\Backend\
```

**2. Install dependencies using pipenv:**

```bash
pipenv install
```

**3. Activate virtual environment:**

```bash
pipenv shell
```

**4. Setup database:**

```bash
python manage.py migrate
```

**5. Start Django server:**

```bash
python manage.py runserver
```

Server will run on `http://localhost:8000`

<div style="page-break-after: always;"></div>

## **Import data to database**

Open file data in folder `Data` and import data to database, make sure to run the command below before importing data:

```bash
USE [YOUR_DATABASE_NAME]
```

## **Frontend Setup**

**1. At folder `Intro2SE`, navigate to Frontend directory:**

```bash
cd .\src\Frontend\
```

**2. Install dependencies:**

```bash
npm install
```

**3. Start development server:**

```bash
npm start
```

Application will run on `http://localhost:3000`

<div style="page-break-after: always;"></div>

## **Environment Variables**

Create `.env` files in both frontend and backend directories:

### **Backend (.env)**

Create `.env` file at location `src\Backend\Restaurant\` with the following content:

```
SECRET_KEY = YOUR_SECRET_KEY

#send email
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = YOUR_EMAIL
EMAIL_HOST_PASSWORD = YOUR_EMAIL_PASSWORD

#aws s3
AWS_ACCESS_KEY_ID = YOUR_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY = YOUR_SECRET_ACCESS_KEY
AWS_STORAGE_BUCKET_NAME = YOUR_BUCKET_NAME
AWS_S3_REGION_NAME = YOUR_REGION_NAME
AWS_MEDIA_LOCATION = 'media'
AWS_STATIC_LOCATION = 'staticfiles'

#database
NAME = YOUR_DATABASE_NAME
HOST = YOUR_DATABASE
PORT = YOUR_DATABASE_PORT
USER = YOUR_DATABASE_USER
PASSWORD = YOUR_DATABASE_PASSWORD
```

Or you can use the `.env` file provided in the project to setup the environment variables.

### **Frontend (.env)**

Create `.env` file at location `src\Frontend\` with the following content:

```
REACT_APP_API_URL=YOUR_API_URL
REACT_APP_RATING_KEY = YOUR_PRIVATE_RATING_KEY
```

Or you can use the `.env` file provided in the project to setup the environment variables.

<div style="page-break-after: always;"></div>

## **Additional Commands**

### **Backend**

- Create superuser: `python manage.py createsuperuser`

### **Frontend**

- Build for production: `npm run build`

## **Login to the system as admin**

- Username: admin
- Password: admin

## **References**

- [Django](https://www.djangoproject.com/)
- [Django REST framework](https://www.django-rest-framework.org/)
- [Django REST framework SimpleJWT](https://django-rest-framework-simplejwt.readthedocs.io/en/latest/)
- [Django Filter](https://django-filter.readthedocs.io/en/stable/)
- [Django phonenumber field](https://django-phonenumber-field.readthedocs.io/en/latest/)
- [Django storages](https://django-storages.readthedocs.io/en/latest/)
- [python-dotenv](https://pypi.org/project/python-dotenv/)
- [React.js](https://reactjs.org/)
- [React Bootstrap](https://react-bootstrap.github.io/)
- [React icons](https://react-icons.github.io/react-icons/)
- [React Router DOM](https://reactrouter.com/web/guides/quick-start)
- [JWT Decode](https://www.npmjs.com/package/jwt-decode)
- [Axios](https://axios-http.com/)
- [QR Code React](https://www.npmjs.com/package/qrcode.react)
- [crypto-js](https://www.npmjs.com/package/crypto-js)
- [React scripts](https://www.npmjs.com/package/react-scripts)
- [yet-another-react-lightbox](https://www.npmjs.com/package/yet-another-react-lightbox)
- [chart.js](https://www.chartjs.org/)
