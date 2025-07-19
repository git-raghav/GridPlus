# GridPlus

A Smart Grid-Solution Software for real-time monitoring, alerting, and management of electrical meters in industrial and commercial environments.

---

## Table of Contents

-   [Overview](#overview)
-   [Features](#features)
-   [Screenshots](#screenshots)
-   [Getting Started](#getting-started)
-   [Project Structure](#project-structure)
-   [Data Model](#data-model)
-   [User Management & Authentication](#user-management--authentication)
-   [Meter Management](#meter-management)
-   [Alert System](#alert-system)
-   [Dashboard & Analytics](#dashboard--analytics)
-   [Email Notifications](#email-notifications)
-   [Customization & Styling](#customization--styling)
-   [License](#license)

---

## Overview

**GridPlus** is a full-stack web application designed to provide a comprehensive solution for smart grid management. It enables users to register, monitor, and manage multiple electrical meters, receive real-time alerts for abnormal readings, and visualize energy data through interactive dashboards and charts. The system is built with Node.js, Express, MongoDB, EJS, and Bootstrap, and features robust authentication, alerting, and data visualization capabilities.

---

## Features

-   **User Authentication**: Secure signup, login, and session management using Passport.js and MongoDB.
-   **Meter Management**: Register, edit, delete, and monitor multiple meters with real-time readings.
-   **Alert System**: Automatic detection of abnormal readings (current, voltage, power factor, temperature, load) and fire prediction, with alert logging and acknowledgment.
-   **Email Notifications**: Sends alert and fire notification emails, as well as payment request emails for meters.
-   **Dashboard & Analytics**: Visualize meter data with line, bar, radar, scatter, doughnut, and polar area charts.
-   **Admin Tools**: Download alert logs as CSV, add comments to alerts, and acknowledge alerts.
-   **Responsive UI**: Modern, mobile-friendly interface with Bootstrap 5 and custom CSS.
-   **Sample Data Initialization**: Easily seed the database with sample meters and alerts for demo/testing.

---

## Screenshots

> _Add screenshots of the dashboard, meter details, alert log, and signup/login pages here._

---

## Getting Started

### Prerequisites

-   **Node.js** v20.16.0
-   **MongoDB** (local or cloud instance)

### Installation

1. **Clone the repository:**
    ```bash
    git clone <repo-url>
    cd GridPlus
    ```
2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Set up environment variables:**
    - Create a `.env` file in the root directory with the following:
        ```env
        MONGO_URL=mongodb://localhost:27017/gridplus
        SESSION_SECRET=your_session_secret
        EMAIL_USER=your_email@gmail.com
        EMAIL_PASS=your_email_password
        NODE_ENV=development
        PORT=3000
        ```
4. **(Optional) Initialize sample data:**

    - Run the script in `init/index.js` to seed the database with sample meters and alerts.

5. **Start the application:**
    ```bash
    npm start
    # or
    node app.js
    ```
6. **Visit the app:**
    - Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
GridPlus/
├── app.js
├── controllers/
│   ├── alert.js
│   ├── meter.js
│   └── user.js
├── init/
│   ├── data.js
│   └── index.js
├── middleware.js
├── models/
│   ├── alert.js
│   ├── meter.js
│   └── user.js
├── public/
│   ├── assets/
│   ├── css/
│   └── javascript/
├── routes/
│   ├── alert.js
│   ├── meter.js
│   └── user.js
├── schema.js
├── utils/
│   ├── email.js
│   ├── ExpressError.js
│   ├── simulateReadingJob.js
│   └── wrapAsync.js
├── views/
│   ├── error.ejs
│   ├── includes/
│   ├── layouts/
│   ├── meters/
│   └── users/
├── package.json
├── README.md
└── LICENSE
```

---

## Data Model

### Meter

-   **Fields:**
    -   `name` (String, required)
    -   `location` (String, required)
    -   `current`, `voltage`, `powerFactor`, `temperature`, `load` (Array of Numbers, last 5 readings)
    -   `status` ("Healthy" or "Alert")
    -   `alertCount` (Number)
    -   `alerts` (Array of Alert references)
    -   `fire` (Boolean, fire detected)
    -   `owner` (User reference)
    -   `createdAt`, `updatedAt` (Date)

### Alert

-   **Fields:**
    -   `name` (String, meter name)
    -   `current`, `voltage`, `powerFactor`, `temperature`, `load` (Number)
    -   `reason` (String, cause of alert)
    -   `acknowledged` (Boolean)
    -   `comment` (String, admin comment)
    -   `triggeredAt` (Date)

### User

-   **Fields:**
    -   `username` (String, unique)
    -   `email` (String, unique)
    -   `password` (Hashed, via Passport.js)

---

## User Management & Authentication

-   **Signup:** Users register with username, email, and password. Passwords must be at least 8 characters, include uppercase, lowercase, number, and special character.
-   **Login:** Secure login with username and password.
-   **Session Management:** Sessions are managed with cookies and stored in MongoDB.
-   **Authorization:** Only logged-in users can create, edit, or delete meters. Only the owner can edit/delete their meters.

---

## Meter Management

-   **Register New Meter:** Add a meter with name and location. Initial readings are simulated.
-   **Edit Meter:** Update name and location (owner only).
-   **Delete Meter:** Remove a meter and its associated alerts (owner only).
-   **View All Meters:** Dashboard lists all meters with status, latest readings, and quick search.
-   **Meter Details:** View detailed analytics, recent alerts, and request payment for a meter.

---

## Alert System

-   **Automatic Alerting:**
    -   Alerts are triggered if readings exceed thresholds:
        -   Current: 1-13 A
        -   Voltage: 220-240 V
        -   Power Factor: 0.4-1
        -   Temperature: -10 to 60°C
        -   Load: 0-3400 W
    -   Fire prediction logic (randomized for demo) can trigger fire alerts.
-   **Alert Log:**
    -   View all alerts, grouped by meter, with acknowledgment and admin comment features.
    -   Download alert log as CSV.
    -   Search and filter alerts by meter name.
-   **Alert Actions:**
    -   Acknowledge alerts (toggle switch)
    -   Add comments to alerts
    -   Call expert (placeholder)

---

## Dashboard & Analytics

-   **Energy Overview:**
    -   Displays total electricity generation and consumption with animated progress bars.
-   **Meter Analytics:**
    -   Line charts for current, voltage, temperature, load
    -   Bar chart for power factor
    -   Scatter plots (Load vs Current, Voltage vs Power Factor)
    -   Doughnut and polar area charts for load distribution and sensor averages
    -   Radar chart for sensor readings over time
    -   Multi-line chart for combined metrics
-   **Recent Alerts:**
    -   List of recent alerts for each meter
-   **Payment Requests:**
    -   Request payment for a meter (sends email)

---

## Email Notifications

-   **Alert Emails:** Sent when a meter triggers an alert (threshold violation)
-   **Fire Alert Emails:** Sent when fire is detected
-   **Payment Request Emails:** Sent on request from the meter dashboard
-   **Configuration:** Requires Gmail or SMTP credentials in `.env`

---

## Customization & Styling

-   **UI:** Built with Bootstrap 5, custom CSS, and EJS templates
-   **Branding:** Includes logo, modern navigation, and responsive design
-   **Assets:** Custom images for meters, alerts, and dashboard

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Author

**Raghav Agarwal**

---

## Acknowledgments

-   [Express.js](https://expressjs.com/)
-   [MongoDB](https://www.mongodb.com/)
-   [Bootstrap](https://getbootstrap.com/)
-   [Chart.js](https://www.chartjs.org/)
-   [Passport.js](http://www.passportjs.org/)
-   [EJS](https://ejs.co/)

---

## Contact

-   [GitHub](https://github.com/git-raghav)
-   [Twitter](https://x.com/raghavsayshii/)
-   [Instagram](https://www.instagram.com/raghavsayshii/)
-   [LinkedIn](https://www.linkedin.com/in/raghav-agarwal-5a7702293/)
