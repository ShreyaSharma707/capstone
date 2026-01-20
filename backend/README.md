
# 🌊 CoastalWatch Backend

CoastalWatch is a backend service designed to monitor coastal sensors, generate alerts, and provide research reports. This backend is built with **Node.js, Express, MongoDB (Mongoose), and Socket.io**.

---

## 🚀 Features

* User authentication & roles (`admin`, `research`, `public`)
* Sensor data ingestion and management
* Real-time alerts with **Socket.io**
* Report generation endpoints
* Database seeding with default users
* Health check endpoints (`/health`, `/health/db`)

---

## 🛠 Tech Stack

* **Node.js** + **Express** → REST API
* **MongoDB (Atlas)** + **Mongoose** → Database
* **Socket.io** → Real-time alerts
* **Cors + Morgan** → Middleware
* **dotenv** → Config management

---

## 📂 Project Structure

```
coastalwatch-backend/
│-- src/
│   │-- config/        # DB connection
│   │-- routes/        # API routes
│   │-- seed/          # Database seeding
│   │-- models/        # Mongoose models
│-- server.js          # App entry point
│-- mg.env             # Local environment variables (ignored in git)
│-- .gitignore
│-- package.json
```

---

## ⚙️ Setup & Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/coastalwatch-backend.git
   cd coastalwatch-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create an environment file (`mg.env`):

   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=4000
   ```

4. Run the server in development mode:

   ```bash
   npm run dev
   ```

---

## 🌱 Database Seeding

Run the following command to insert default users (`admin`, `research`, `public`):

```bash
npm run seed
```

---

## ✅ Health Check

* `GET /health` → API status
* `GET /health/db` → Database connection state

---

## 📡 API Routes

* `/api/auth` → Authentication
* `/api/users` → User management
* `/api/sensors` → Sensor data
* `/api/alerts` → Alerts
* `/api/reports` → Reports

---

## 👩‍💻 Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you’d like to change.

---

## 📜 License

This project is licensed under the MIT License.
