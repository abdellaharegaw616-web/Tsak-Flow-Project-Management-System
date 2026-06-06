const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

const path = require('path');
// serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/team', require('./routes/teamRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/portfolio', require('./routes/portfolioRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/time-tracking', require('./routes/timeTrackingRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'TaskFlow API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
