# Vehicle Parking Management System - Server

This is the backend server for the Vehicle Parking Management System built with Node.js, Express, and MongoDB.

## Project Structure

```
Server/
├── app.js                  # Main application file
├── package.json           # Project dependencies
├── .env                   # Environment variables
│
├── config/
│   ├── db.js             # Database connection
│   ├── cors.js           # CORS configuration
│   └── cloudinary.js     # Cloudinary configuration (optional)
│
├── models/
│   ├── User.js           # User model
│   ├── Stand.js          # Vehicle stand model
│   └── Parking.js        # Parking record model
│
├── controllers/
│   ├── auth.controller.js      # Authentication controller
│   ├── stand.controller.js     # Stand management controller
│   ├── staff.controller.js     # Staff management controller
│   ├── parking.controller.js   # Parking operations controller
│   └── report.controller.js    # Reporting controller
│
├── routes/
│   ├── auth.routes.js          # Authentication routes
│   ├── stand.routes.js         # Stand routes
│   ├── staff.routes.js         # Staff routes
│   ├── parking.routes.js       # Parking routes
│   └── report.routes.js        # Report routes
│
├── middleware/
│   ├── auth.middleware.js      # Authentication middleware
│   ├── role.middleware.js      # Role-based access control
│   └── error.middleware.js     # Error handling middleware
│
├── services/
│   ├── token.service.js        # JWT token service
│   ├── pricing.service.js      # Pricing calculation service
│   └── report.service.js       # Report generation service
│
├── utils/
│   ├── generateToken.js        # Token generation utilities
│   ├── calculateAmount.js      # Amount calculation utilities
│   └── formatDate.js           # Date formatting utilities
│
└── validations/
    ├── auth.validation.js      # Authentication validation
    ├── stand.validation.js     # Stand validation
    └── parking.validation.js   # Parking validation
```

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing
- **Joi** - Validation
- **Cors** - Cross-origin resource sharing
- **Helmet** - Security headers
- **Morgan** - HTTP request logger

## Setup Instructions

1. **Install dependencies:**
   ```bash
   cd Server
   npm install
   ```

2. **Configure environment variables:**
   - Rename `.env.example` to `.env`
   - Update the MongoDB connection string
   - Set your JWT secret

3. **Start the server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (Protected)
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### Vehicle Stands
- `GET /api/stands` - Get all stands (Protected)
- `GET /api/stands/:id` - Get single stand (Protected)
- `POST /api/stands` - Create stand (Super Admin only)
- `PUT /api/stands/:id` - Update stand (Super Admin only)
- `DELETE /api/stands/:id` - Delete stand (Super Admin only)
- `PUT /api/stands/:id/assign-admin` - Assign admin to stand (Super Admin only)

### Staff Management
- `GET /api/staff` - Get all staff (Stand Admin only)
- `GET /api/staff/:id` - Get single staff member (Stand Admin only)
- `POST /api/staff` - Create staff member (Stand Admin only)
- `PUT /api/staff/:id` - Update staff member (Stand Admin only)
- `DELETE /api/staff/:id` - Delete staff member (Stand Admin only)
- `GET /api/staff/stats` - Get staff statistics (Stand Admin only)

### Parking Operations
- `GET /api/parkings` - Get all parkings (Admin roles)
- `GET /api/parkings/:id` - Get single parking (Staff only)
- `POST /api/parkings` - Create parking entry (Staff only)
- `PUT /api/parkings/:id` - Update parking (Staff only)
- `POST /api/parkings/:id/checkout` - Checkout vehicle (Staff only)
- `GET /api/parkings/today` - Get today's parkings (Staff only)

### Reports
- `GET /api/reports/daily` - Get daily report (Admin roles)
- `GET /api/reports/monthly` - Get monthly report (Admin roles)
- `GET /api/reports/stand/:standId` - Get stand report (Admin roles)
- `GET /api/reports/revenue` - Get revenue statistics (Admin roles)

## User Roles

1. **Super Admin** - Full system access
2. **Stand Admin** - Manage staff and view reports for assigned stand
3. **Staff** - Handle parking operations for assigned stand

## Environment Variables

```env
PORT=5000
MONGO_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>/<DB_NAME>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
SUPERADMIN_EMAIL=admin@bikestand.com
SUPERADMIN_PASSWORD=Admin@123
NODE_ENV=development
```

## Development

- Uses **nodemon** for auto-restart during development
- **Morgan** for HTTP request logging
- **Helmet** for security headers
- **CORS** configured for frontend integration

## Database Models

### User
- name, email, password, phone
- role (super_admin, stand_admin, staff)
- stand reference
- isActive status

### Stand
- name, location, capacity
- hourlyRate, currentOccupancy
- admin reference
- status (active, inactive, maintenance)

### Parking
- vehicleNumber, vehicleType
- customerName, customerPhone
- stand reference, staff reference
- entryTime, exitTime, duration
- amount, status, paymentStatus

## Error Handling

- Custom error middleware
- Validation error handling
- MongoDB error handling
- JWT error handling