# 🌊 Ocean Hazard Watch - Integrated Coastal Monitoring System

Ocean Hazard Watch is a comprehensive coastal monitoring system that enables citizens to report ocean hazards, view real-time alerts, and support coastal safety through advanced monitoring technology. The system consists of a modern React frontend, Node.js backend API, and a central dashboard for easy navigation between services.

## 🎯 Features

- **🗺️ Interactive Hazard Map**: Real-time visualization of ocean hazards with detailed markers
- **📝 Hazard Reporting**: Easy-to-use form for citizens to report ocean hazards
- **⚡ Real-time Alerts**: Live updates via Socket.io for immediate hazard notifications
- **📊 Comprehensive Dashboard**: Central hub to monitor all services and their status
- **📱 Responsive Design**: Modern, mobile-friendly interface that works on all devices
- **🔒 Secure API**: RESTful backend with authentication and data validation

## 📁 Project Structure

```
ocean-hazard-watch/
├── run_all.py                    # Orchestrator script to start all services
├── requirements.txt              # Python dependencies
├── README.md                     # This file
├── dashboard/                    # Central navigation dashboard (Flask)
│   ├── app.py                    # Flask application
│   └── templates/
│       └── index.html            # Beautiful dashboard UI
├── backend/                      # Node.js API server
│   ├── server.js                 # Express server with Socket.io
│   ├── package.json              # Node.js dependencies
│   ├── mg.env                    # MongoDB configuration
│   ├── src/
│   │   ├── config/               # Database and app configuration
│   │   ├── routes/               # API routes (auth, sensors, alerts, reports)
│   │   ├── models/               # Mongoose data models
│   │   └── seed/                 # Database seeding scripts
│   └── tests/                    # Backend unit and integration tests
├── frontend/                     # React user interface
│   ├── package.json              # Frontend dependencies
│   ├── vite.config.js            # Vite build configuration
│   ├── .env                      # Frontend environment variables
│   ├── src/
│   │   ├── components/           # React components (Home, ReportForm, AlertsMap)
│   │   ├── config/               # API and Socket.io configuration
│   │   └── App.css               # Modern styling with gradients and animations
│   └── tests/                    # Frontend unit and integration tests
├── models/                       # Future ML models directory
└── tests/                        # System integration tests
```

## 🚀 Quick Start Guide

### Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download here](https://python.org/)
- **MongoDB** (local installation or MongoDB Atlas) - [Download here](https://mongodb.com/)
- **npm** (comes with Node.js)

### 📦 Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd ocean-hazard-watch
   ```

2. **Install Python dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Install backend dependencies:**

   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

### ⚙️ Configuration

**Backend Configuration** - Create `backend/mg.env`:

```env
MONGO_URI=mongodb://localhost:27017/oceanhazardwatch
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/oceanhazardwatch
PORT=4000
```

**Frontend Configuration** - Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:4000
```

## 🎯 Running the Application

### Option 1: Start All Services (Recommended)

**Using the Orchestrator Script:**

```bash
python run_all.py
```

This single command starts all three services:

- 📊 **Dashboard** at http://localhost:5000
- ⚙️ **Backend API** at http://localhost:4000
- 🌊 **Frontend UI** at http://localhost:5173

**To stop all services:** Press `Ctrl+C` in the terminal.

### Option 2: Start Services Individually

For development or debugging, start each service in separate terminals:

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev        # Development mode with auto-reload
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev        # Development mode with hot reload
```

**Terminal 3 - Dashboard:**

```bash
cd dashboard
python app.py      # Dashboard service
```

## 🌐 Accessing the Application

Once all services are running, you can access:

| Service                   | URL                   | Description                                            |
| ------------------------- | --------------------- | ------------------------------------------------------ |
| **🎛️ Main Dashboard**     | http://localhost:5000 | Central hub showing service status with launch buttons |
| **🌊 Ocean Hazard Watch** | http://localhost:5173 | Main application - report hazards and view alerts      |
| **⚙️ Backend API**        | http://localhost:4000 | REST API endpoints and health checks                   |

### 🎯 Recommended Usage Flow:

1. **Start with Dashboard** (http://localhost:5000) to see all services
2. **Click "Launch Service"** for Ocean Hazard Watch to open the main app
3. **Use the main app** to:
   - View the interactive hazard map with test data
   - Submit hazard reports
   - See real-time alerts and notifications

## 🗺️ Application Features

### 🏠 Home Page

- **Modern Design**: Beautiful gradient background with glass-morphism cards
- **Quick Navigation**: Easy access to report hazards or view alerts
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile

### 📝 Hazard Reporting

- **User-Friendly Form**: Simple form to report ocean hazards
- **Hazard Types**: Oil spills, floating debris, high waves, coastal flooding, and more
- **Location Capture**: Get current location or manually specify location
- **Media Upload**: Attach photos or videos of hazards
- **Real-time Validation**: Instant feedback on form completion

### 🗺️ Interactive Alerts Map

- **Live Hazard Map**: Interactive map showing all reported hazards and system alerts
- **Rich Test Data**: 11 comprehensive test markers across Indian coastal regions
- **Detailed Popups**: Click markers for full hazard information including:
  - Hazard type with severity color coding
  - Source (citizen report vs system alert)
  - Detailed description and timestamp
  - Severity levels: 🚨 Critical, ⚠️ High, ⚡ Medium, ℹ️ Low
- **Summary Dashboard**: Overview of hazard types and counts
- **Real-time Updates**: Live updates via Socket.io when new hazards are reported

### 📊 Test Data Included

The application comes with comprehensive test data showing:

- **8 Hazard Reports**: Oil spills, high waves, floating debris, coastal flooding
- **3 System Alerts**: Weather warnings, navigation restrictions, environmental alerts
- **Geographic Coverage**: Major coastal cities across India (Mumbai, Chennai, Kolkata, etc.)
- **Severity Levels**: Mix of critical, high, medium, and low severity incidents

## 🔌 Service Architecture

| Service         | Port | Technology                              | Purpose                                         |
| --------------- | ---- | --------------------------------------- | ----------------------------------------------- |
| **Dashboard**   | 5000 | Flask + HTML/CSS                        | Service launcher and status monitor             |
| **Backend API** | 4000 | Node.js + Express + MongoDB + Socket.io | REST API, real-time communication, data storage |
| **Frontend UI** | 5173 | React + Vite + Leaflet + Tailwind CSS   | User interface, maps, forms                     |

### 🔄 Real-time Features

- **Socket.io Integration**: Instant notifications for new hazards
- **Live Map Updates**: Markers appear immediately when hazards are reported
- **Connection Management**: Automatic reconnection handling
- **Real-time Status**: Dashboard shows live service status

## 🧪 Testing

### Running Tests

**Backend Tests:**

```bash
cd backend
npm test              # Run all backend tests
npm run test:watch    # Watch mode for development
```

**Frontend Tests:**

```bash
cd frontend
npm test              # Run all frontend tests
npm run test:watch    # Watch mode for development
npm run test:ui       # Interactive UI test runner
```

**Integration Tests:**

```bash
# From project root
python -m pytest tests/
```

### Test Coverage

- **Backend**: API endpoints, database operations, Socket.io events
- **Frontend**: Component rendering, user interactions, API integration
- **Integration**: End-to-end workflows, service communication

## 🔧 API Endpoints

### Health Checks

- `GET /` - API information and available endpoints
- `GET /health` - Service health status
- `GET /health/db` - Database connection status

### Data Management

- `GET /api/reports` - Get hazard reports
- `POST /api/reports` - Submit new hazard report
- `GET /api/alerts` - Get system alerts
- `GET /api/sensors` - Get sensor data

### Authentication (Future)

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

## 🛠️ Development

### Development Mode

For active development, start services individually with hot reload:

```bash
# Terminal 1 - Backend with auto-restart
cd backend
npm run dev

# Terminal 2 - Frontend with hot reload
cd frontend
npm run dev

# Terminal 3 - Dashboard
cd dashboard
python app.py
```

### Building for Production

**Frontend Build:**

```bash
cd frontend
npm run build        # Creates optimized production build
npm run preview      # Preview the production build
```

**Backend Production:**

```bash
cd backend
npm start           # Production mode
```

### Environment Variables

**Backend (`backend/mg.env`):**

```env
MONGO_URI=mongodb://localhost:27017/oceanhazardwatch
PORT=4000
NODE_ENV=development
JWT_SECRET=your-secret-key-here
```

**Frontend (`frontend/.env`):**

```env
VITE_API_URL=http://localhost:4000
```

## 🚨 Troubleshooting

### Common Issues and Solutions

#### 🔴 "Cannot GET /" Error

**Problem**: Accessing backend directly shows "Cannot GET /"
**Solution**:

- Access the frontend at http://localhost:5173 instead
- The backend at http://localhost:4000 now shows API information
- Use the dashboard at http://localhost:5000 for service navigation

#### 🔴 Port Already in Use

**Problem**: Error starting services due to port conflicts
**Solution**:

```bash
# Windows - Check and kill process using port
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# macOS/Linux - Check and kill process using port
lsof -i :4000
kill -9 <PID>
```

#### 🔴 Frontend Shows "Service Offline"

**Problem**: Dashboard shows frontend as offline
**Solution**:

- Ensure frontend is running on port 5173
- Check that `npm run dev` is active in frontend directory
- Refresh the dashboard page after starting frontend

#### 🔴 No Test Data on Map

**Problem**: Alerts map appears empty
**Solution**:

- Wait for the 1-second loading animation to complete
- Check browser console for any JavaScript errors
- Ensure all services are running (backend provides the map functionality)
- Try refreshing the page

#### 🔴 MongoDB Connection Issues

**Problem**: Backend fails to connect to database
**Solution**:

- **Local MongoDB**: Ensure MongoDB service is running

  ```bash
  # Windows
  net start MongoDB

  # macOS
  brew services start mongodb-community

  # Linux
  sudo systemctl start mongod
  ```

- **MongoDB Atlas**: Verify connection string in `backend/mg.env`
- Check network connectivity and firewall settings

#### 🔴 Dependencies Installation Fails

**Problem**: `npm install` or `pip install` fails
**Solution**:

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# For Python dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

#### 🔴 Services Start But Can't Communicate

**Problem**: Services run but can't connect to each other
**Solution**:

- Verify environment variables in `.env` files
- Check that CORS is properly configured in backend
- Ensure no firewall blocking local connections
- Verify API_BASE_URL in frontend config

### 🔍 Debug Mode

**Enable detailed logging:**

```bash
# Backend with debug logs
cd backend
DEBUG=* npm run dev

# Check frontend network requests
# Open browser DevTools → Network tab while using the app
```

### 📋 Health Check Commands

**Verify all services are responding:**

```bash
# Check backend health
curl http://localhost:4000/health

# Check if frontend is serving
curl -I http://localhost:5173

# Check dashboard
curl -I http://localhost:5000
```

### 🆘 Still Having Issues?

1. **Check Prerequisites**: Ensure Node.js, Python, and MongoDB are properly installed
2. **Review Logs**: Check terminal output for specific error messages
3. **Restart Services**: Stop all services and restart using the orchestrator
4. **Clean Installation**: Delete `node_modules` folders and reinstall dependencies
5. **Environment Files**: Double-check `.env` and `mg.env` file contents

## 📝 Additional Notes

### 🔧 Customization

- **Styling**: Modify `frontend/src/App.css` for UI customization
- **Test Data**: Update `frontend/src/components/AlertsMap.jsx` to modify map markers
- **API Endpoints**: Add new routes in `backend/src/routes/`

### 🚀 Deployment

For production deployment:

1. Build the frontend: `npm run build` in frontend directory
2. Set production environment variables
3. Use a process manager like PM2 for the backend
4. Configure reverse proxy (nginx) for routing
5. Set up MongoDB with proper security settings

### 📊 Monitoring

- **Dashboard**: Use http://localhost:5000 to monitor service status
- **API Health**: Check http://localhost:4000/health for backend status
- **Database**: Use http://localhost:4000/health/db for database connectivity

---

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests to ensure everything works
5. Submit a pull request

---

**🌊 Happy Coastal Monitoring! 🌊**

For additional support or questions, please check the individual service documentation in the `backend/` and `frontend/` directories.
