# MedConnect 🏥

MedConnect is a comprehensive full-stack healthcare platform that enables users to book doctor appointments and medical tests online, chat with doctors in real time, participate in health campaigns, and access medical reports. The platform supports role-based access for system admins, hospital admins, doctors, and users.

---

## 🚀 Features

### 👥 Users
- **Account Management**: Register, login, and reset password functionality
- **Appointment Booking**: Book doctor appointments or medical tests with online or on-site payment options
- **Real-time Communication**: Chat with doctors in real-time
- **Medical Reports**: View and download test reports
- **Health Campaigns**: Volunteer for health campaigns and community initiatives
- **Notifications**: Get instant notifications for appointments and updates

### 🏥 Hospital Admins
- **Hospital Management**: Manage hospital profile and information
- **Resource Management**: Add doctors, medical tests, and health campaigns
- **Report Management**: Upload and manage medical test results
- **Volunteer Coordination**: Manage volunteers for health campaigns

### 👨‍⚕️ Doctors
- **Appointment Management**: View and manage patient appointments
- **Patient Communication**: Chat with patients in real-time
- **Schedule Management**: Manage availability and consultation hours

### 🛡️ System Admins
- **Platform Oversight**: Create hospitals and assign hospital admins
- **Monitoring**: Monitor and manage overall platform activities
- **User Management**: Oversee user accounts and permissions

---

## 🧱 Tech Stack

| Category | Frontend | Backend |
|----------|----------|---------|
| **Framework** | React.js | Node.js, Express.js |
| **Database** | — | MongoDB, Mongoose |
| **Styling** | Tailwind CSS | — |
| **State Management** | Redux Toolkit | — |
| **Real-time** | Socket.IO Client | Socket.IO |
| **Payment** | — | Khalti Payment Gateway |
| **Authentication** | — | JWT, Bcrypt |
| **File Upload** | — | Multer |
| **Email** | — | Nodemailer |
| **Build Tool** | Vite | — |
| **HTTP Client** | Axios | — |

---

## 📁 Project Structure

```
MedConnect/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── store/          # Redux store configuration
│   │   ├── utils/          # Utility functions
│   │   └── App.jsx         # Main App component
│   ├── public/             # Static assets
│   └── package.json
├── server/                 # Backend Node.js application
│   ├── controllers/        # Route controllers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── config/             # Configuration files
│   └── server.js           # Main server file
├── shared/                 # Shared constants and utilities
└── README.md
```

---

## ⚙️ Setup Instructions

### 🔧 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**
- **npm** or **yarn**

### 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/medconnect.git
   cd medconnect
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

### 🌐 Environment Variables

Create `.env` files in both `server/` and `client/` directories.

**Server Environment Variables** (`server/.env`):
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
KHALTI_SECRET_KEY=your_khalti_test_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
NODE_ENV=development
```

**Client Environment Variables** (`client/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 🚀 Running the Application

1. **Start the Backend Server**
   ```bash
   cd server
   npm run dev
   ```
   The server will start on `http://localhost:5000`

2. **Start the Frontend Application**
   ```bash
   cd client
   npm run dev
   ```
   The client will start on `http://localhost:5173`

3. **Access the Application**
   Open your browser and navigate to `http://localhost:5173`

---

## 🛡️ Security & Maintenance

### Vulnerability Management
This project uses automated security scanning to detect vulnerabilities. Regularly update dependencies:

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Force fix (use with caution)
npm audit fix --force
```

### Best Practices
- Keep dependencies updated
- Use environment variables for sensitive data
- Implement proper input validation
- Use HTTPS in production
- Regular security audits

## 🚢 Deployment

### Backend Deployment (Railway/Render)
1. Create account on Railway or Render
2. Connect your GitHub repository
3. Set environment variables in the platform
4. Deploy the `server` directory

### Frontend Deployment (Vercel/Netlify)
1. Create account on Vercel or Netlify
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use ESLint and Prettier for code formatting
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic

---

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Asim Khadka**
- GitHub: [@Asim1O1](https://github.com/Asim1O1)
- Email: your-email@example.com
- LinkedIn: [Your LinkedIn Profile](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- Thanks to all contributors who helped build this project
- Special thanks to the open-source community for the amazing tools and libraries
- Healthcare workers who inspired this project

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/medconnect/issues) page
2. Create a new issue if your problem isn't already reported
3. Contact the maintainer via email

---

**⭐ If you found this project helpful, please give it a star!**
