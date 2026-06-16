# Project Management System

A comprehensive full-stack project management application designed to help organizations manage projects, tasks, resources, finances, and team collaboration within a single integrated platform. Built with React, Node.js, Express.js, and MongoDB.

**Problem Solved:** Many organizations use separate tools for project tracking, task management, team collaboration, and financial monitoring. This leads to data inconsistency, communication gaps, and reduced efficiency. Our system provides a centralized solution that integrates all these functionalities into one application, improving productivity, organization, communication, and decision-making.

**Live Demo:** [Project Management System](https://project-management-system-app-topaz.vercel.app/)  
**Backend API:** [API Server](https://project-management-system-hxs8.onrender.com)

## 🎯 Features

- **Dashboard**: Real-time overview of projects, tasks, and team performance
- **Projects Management**: Create, track, and manage multiple projects with status monitoring
- **Task Management**: Kanban board with drag-and-drop functionality for task organization
- **Resource Planning**: Allocate and optimize team resources with utilization metrics
- **Portfolio View**: Strategic overview of all projects and initiatives
- **Team Collaboration**: Messaging, meetings, and team member management
- **Time Tracking**: Monitor time spent on projects and tasks
- **Finance Management**: Track budgets, expenses, and invoices
- **Calendar**: Integrated calendar with project deadlines and meetings
- **Automations**: Create automated workflows and triggers
- **Goals & Objectives**: Set and track team and project goals
- **Reports**: Generate comprehensive project and performance reports
- **Dark Mode**: Built-in dark mode support for better accessibility

## 🛠 Tech Stack

### Frontend
- **React 19.2.5** - UI framework
- **Vite 8.0.10** - Build tool and dev server
- **Tailwind CSS 3.4.19** - Utility-first CSS framework
- **React Router 7.15.0** - Client-side routing
- **Axios 1.16.0** - HTTP client for API calls
- **Lucide React 1.14.0** - Icon library
- **React Hot Toast 2.6.0** - Toast notifications
- **Framer Motion 12.38.0** - Animations and transitions
- **Hello Pangea DnD 18.0.1** - Drag and drop functionality
- **PostCSS 8.5.14** - CSS processing
- **Autoprefixer 10.5.0** - CSS vendor prefixing
- **ESLint 10.2.1** - Code linting

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js 5.2.1** - Web framework
- **MongoDB Atlas** - Cloud NoSQL database
- **Mongoose 9.6.1** - MongoDB ODM (Object Data Modeling)
- **JsonWebToken 9.0.3** - JWT authentication
- **bcryptjs 3.0.3** - Password hashing and encryption
- **CORS 2.8.6** - Cross-origin resource sharing middleware
- **Cookie-parser 1.4.7** - Cookie parsing middleware
- **Multer 1.4.5** - File upload handling middleware
- **Dotenv 17.4.2** - Environment variable management
- **Nodemon 3.1.14** - Development server with auto-reload

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/abdellaharegaw616-web/Project-Management-System.git
cd Project\ Management\ System
```

2. **Install dependencies**
```bash
npm install
cd server && npm install
cd ../client && npm install
```

3. **Configure environment variables**

Create `.env` file in the root and `server/.env`:

```bash
# .env (root)
NODE_ENV=development

# server/.env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

4. **Start the application**

```bash
# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend
cd client
npm run dev
```

Visit `http://localhost:5173`

## 📂 Project Structure

```
Project Management System/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── common/              # Common UI components
│   │   │   ├── layout/              # Layout components
│   │   │   ├── projects/            # Project modals
│   │   │   ├── resources/           # Resource modals
│   │   │   └── tasks/               # Task modals
│   │   ├── context/                 # React context (Auth)
│   │   ├── layouts/                 # Page layouts
│   │   ├── pages/                   # Page components
│   │   │   ├── auth/                # Login/Register
│   │   │   ├── dashboard/           # Dashboard
│   │   │   ├── projects/            # Projects
│   │   │   ├── tasks/               # Kanban board
│   │   │   ├── portfolio/           # Portfolio view
│   │   │   ├── resource-planning/   # Resource management
│   │   │   ├── meetings/            # Meetings
│   │   │   ├── messages/            # Messaging
│   │   │   ├── finance/             # Finance tracking
│   │   │   ├── calendar/            # Calendar view
│   │   │   ├── reports/             # Reports
│   │   │   ├── goals/               # Goals management
│   │   │   ├── time-tracking/       # Time tracking
│   │   │   ├── automations/         # Automations
│   │   │   ├── documents/           # Document management
│   │   │   ├── settings/            # Settings
│   │   │   └── team/                # Team management
│   │   ├── App.jsx                  # Main App component
│   │   └── main.jsx                 # Entry point
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
│
├── server/                          # Express.js backend
│   ├── config/                      # Database configuration
│   ├── controllers/                 # Route controllers
│   ├── middleware/                  # Custom middleware
│   ├── models/                      # Mongoose schemas
│   ├── routes/                      # API routes
│   ├── public/uploads/              # Uploaded files
│   ├── server.js                    # Server entry point
│   ├── package.json
│   └── .env                         # Environment variables
│
└── package.json                     # Root package.json
```

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/portfolio` - Get portfolio projects

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Resources
- `GET /api/resources` - Get all resources
- `POST /api/resources` - Create resource
- `PUT /api/resources/:id` - Update resource

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create goal
- `PUT /api/goals/:id` - Update goal

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Teams
- `GET /api/team/members` - Get team members
- `POST /api/team/members` - Add team member

### Notifications
- `GET /api/notifications` - Get notifications

### Messages
- `GET /api/messages/conversations` - Get conversations
- `POST /api/messages` - Send message
- `GET /api/messages/:conversationId` - Get messages

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication with HTTP-only cookies:

1. User registers or logs in
2. Server returns a JWT via a secure HTTP-only cookie
3. The browser sends the cookie automatically with authenticated requests
4. Server verifies the token for protected routes

## 🚢 Deployment

### Option 1: Heroku
```bash
heroku create your-app-name
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

### Option 2: DigitalOcean
- Create Ubuntu droplet
- Install Node.js and MongoDB
- Use PM2 for process management
- Setup Nginx as reverse proxy
- Configure SSL with Certbot

### Option 3: Docker
```bash
docker-compose up -d
```

### Option 4: Vercel (Frontend) + Render (Backend)
- Deploy frontend on Vercel
- Deploy backend on Render
- Connect services using environment variables

#### Frontend on Vercel
1. Import repository into Vercel
2. Set the root directory to `client`
3. Framework preset: Vite
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add environment variable:
   - `VITE_API_URL=https://<your-backend-service>.onrender.com/api`

#### Backend on Render
1. Create a new Web Service
2. Connect the same repository
3. Set the root directory to `server`
4. Environment: Node
5. Build command: `npm install`
6. Start command: `npm start`
7. Add environment variables:
   - `MONGO_URI=your_mongodb_connection_string`
   - `JWT_SECRET=your_jwt_secret_key`
   - `CLIENT_URL=https://<your-vercel-domain>`
   - `NODE_ENV=production`

#### Important notes
- The backend now uses `sameSite=None` and `secure=true` for auth cookies in production.
- Make sure `CLIENT_URL` on Render matches your Vercel frontend domain.
- Set `VITE_API_URL` in Vercel to point to the Render backend API endpoint.

## 📝 Usage

### Create a Project
1. Navigate to Projects page
2. Click "New Project"
3. Fill in project details
4. Set deadline and priority
5. Add team members
6. Click Create

### Manage Tasks
1. Go to Tasks/Kanban Board
2. Create task with title, description, and assignee
3. Drag tasks between columns (Todo, In Progress, Review, Completed)
4. Click task to view details and add comments

### Resource Planning
1. Visit Resource Planning page
2. Click "Add Resource" to add team members
3. Click "Schedule" to plan meetings
4. View utilization metrics and allocations

### Portfolio Overview
1. Portfolio page shows all projects
2. View key metrics (budget, ROI, progress)
3. Filter by status and priority
4. Switch between grid and list views

## 🎓 Challenges & Solutions

### Challenge 1: Real-time Time Tracking
**Problem:** Implementing accurate time tracking that captures work sessions in real-time.  
**Solution:** Implemented a timer using JavaScript `setInterval` that updates every second and persists session data to the backend when stopped, ensuring accurate records of work hours.

### Challenge 2: Complex Filtering
**Problem:** Handling multi-criteria filtering across projects, tasks, and resources.  
**Solution:** Created reusable filter components with state management for search queries, dropdown filters, and multi-criteria filtering capabilities.

### Challenge 3: Deployment Configuration
**Problem:** Configuring secure deployment across multiple cloud services with proper CORS and environment variable management.  
**Solution:** Set up environment variables for Vercel (frontend) and Render (backend) with proper CORS configuration for seamless cross-origin communication.

### Challenge 4: Data Consistency
**Problem:** Ensuring data integrity across distributed operations.  
**Solution:** Used MongoDB error handling and input validation to maintain data consistency throughout the application.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**Abdellah Aregaw**
- GitHub: [@abdellaharegaw616-web](https://github.com/abdellaharegaw616-web)
- Email: abdellaharegaw616@gmail.com

## 🙏 Acknowledgments

- React and Vite communities
- Tailwind CSS for styling
- MongoDB for database
- All contributors and users

## 📞 Support

For issues and questions, please open an issue on [GitHub Issues](https://github.com/abdellaharegaw616-web/Project-Management-System/issues)

---

**Last Updated:** June 15, 2026
