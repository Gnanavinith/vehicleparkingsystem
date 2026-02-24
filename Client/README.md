# Vehicle Parking Management System - Client

This is the frontend application for the Vehicle Parking Management System built with React, Vite, and Tailwind CSS.

## Project Structure

```
src/
├── main.jsx                 # Entry point
├── App.jsx                  # Main application component with routing
│
├── app/
│   ├── store.js            # Redux store configuration
│   └── queryClient.js      # React Query client configuration
│
├── assets/
│   ├── images/
│   └── icons/
│
├── config/
│   ├── axios.js           # Axios instance with interceptors
│   ├── routes.js          # Route constants
│   └── constants.js       # Application constants
│
├── redux/
│   └── slices/
│       ├── authSlice.js   # Authentication state management
│       └── uiSlice.js     # UI state management
│
├── providers/
│   ├── ReduxProvider.jsx  # Redux provider wrapper
│   └── QueryProvider.jsx  # React Query provider wrapper
│
├── layouts/
│   ├── AuthLayout.jsx     # Authentication layout
│   ├── SuperAdminLayout.jsx # Super admin layout
│   ├── StandAdminLayout.jsx # Stand admin layout
│   └── StaffLayout.jsx    # Staff layout
│
├── components/
│   ├── common/
│   │   ├── Button.jsx     # Reusable button component
│   │   ├── Input.jsx      # Reusable input component
│   │   ├── Modal.jsx      # Reusable modal component
│   │   └── Loader.jsx     # Loading spinner component
│   │
│   ├── navbar/
│   │   └── Navbar.jsx     # Navigation bar component
│   │
│   └── tables/
│       └── DataTable.jsx  # Reusable data table component
│
├── routes/
│   └── ProtectedRoutes.jsx # Protected route component
│
├── features/
│   ├── auth/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   └── ForgotPassword.jsx
│   │   ├── api.js
│   │   └── hooks.js
│   │
│   ├── superadmin/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── VehicleStands.jsx
│   │   │   ├── CreateStand.jsx
│   │   │   └── StandAdmins.jsx
│   │   └── api.js
│   │
│   ├── standadmin/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Staff.jsx
│   │   │   ├── CreateStaff.jsx
│   │   │   ├── Parkings.jsx
│   │   │   └── Reports.jsx
│   │   └── api.js
│   │
│   └── staff/
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── NewParking.jsx
│       │   ├── Checkout.jsx
│       │   └── TodayList.jsx
│       └── api.js
│
├── utils/
│   ├── calculateAmount.js # Utility functions for calculations
│   ├── generateToken.js   # Token generation utilities
│   └── formatDate.js      # Date formatting utilities
│
└── styles/
    └── global.css         # Global styles and Tailwind customizations
```

## Technologies Used

- **React 19** - Frontend library
- **Vite** - Build tool and development server
- **React Router DOM** - Client-side routing
- **Redux Toolkit** - State management
- **React Query** - Server state management
- **Tailwind CSS** - Styling framework
- **Axios** - HTTP client

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## User Roles

1. **Super Admin** - Manages vehicle stands and stand admins
2. **Stand Admin** - Manages staff and parking records for their stand
3. **Staff** - Handles day-to-day parking operations

## Features

- User authentication with role-based access
- Dashboard for each user role
- Vehicle stand management
- Staff management
- Parking entry and checkout
- Reporting and analytics
- Responsive design

## Development Setup

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Open browser at `http://localhost:5173`

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost:5000/api
```
