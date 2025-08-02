https://youtu.be/uvNFNDCO7zQ?si=Ma_trLP0OKPLy0k2 ->WORKING PROCESS OF MY PROJECT
# HalleyX E-Commerce Portal - React Frontend

This is the React frontend for the HalleyX E-Commerce Portal, converted from the original HTML/CSS/JavaScript implementation.

## Features

- **Customer Portal**: Browse products, manage orders, update profile
- **Admin Portal**: Manage products, customers, orders, and view statistics
- **AI Chat Widget**: Interactive chat assistant with voice support
- **Voice Assistant**: Web Speech API integration for voice commands
- **Responsive Design**: Neon cyberpunk theme with modern UI
- **Authentication**: JWT-based authentication for customers and admins
- **Shopping Cart**: Add products to cart and checkout functionality

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Backend server running on `http://localhost:5000`

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will open in your browser at `http://localhost:3000`.

## Project Structure

```
frontend/
├── public/
│   └── index.html          # Main HTML file
├── src/
│   ├── components/         # React components
│   │   ├── CustomerPortal.js
│   │   ├── AdminPortal.js
│   │   ├── AIChatWidget.js
│   │   ├── VoiceAssistant.js
│   │   └── ...
│   ├── contexts/          # React contexts
│   │   ├── AuthContext.js
│   │   └── CartContext.js
│   ├── App.js            # Main App component
│   ├── index.js          # React entry point
│   └── index.css         # Global styles
├── package.json
└── README.md
```

## Key Components

### Customer Portal
- **CustomerAuth**: Login/Register forms
- **CustomerDashboard**: Main customer interface
- **ProductList**: Browse and search products
- **OrderList**: View order history
- **CustomerProfile**: Update profile information
- **CheckoutForm**: Complete purchase process

### Admin Portal
- **AdminAuth**: Admin login
- **AdminDashboard**: Admin interface with tabs
- **AdminStats**: Dashboard statistics
- **AdminProductManagement**: CRUD operations for products
- **AdminCustomerManagement**: Manage customers and impersonation
- **AdminOrderManagement**: Process and update orders

### AI Features
- **AIChatWidget**: Interactive chat assistant
- **VoiceAssistant**: Voice command integration

## API Integration

The frontend communicates with the backend API endpoints:

- `/api/auth/*` - Authentication endpoints
- `/api/products/*` - Product management
- `/api/customers/*` - Customer management
- `/api/orders/*` - Order management
- `/api/settings/*` - Admin dashboard stats

## Styling

The application uses CSS custom properties for the neon cyberpunk theme:

- Primary color: `#00fff7` (Neon Cyan)
- Secondary color: `#ff00d4` (Neon Magenta)
- Background: `#0d1117` (Dark Navy)
- Text: `#aaffff` (Light Cyan)

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Backend Requirements

Make sure your backend server is running on `http://localhost:5000` with the following features:

- JWT authentication
- Product management API
- Customer management API
- Order management API
- Admin dashboard statistics

## Browser Compatibility

- Modern browsers with ES6+ support
- Web Speech API for voice features (Chrome, Edge, Safari)
- Responsive design for mobile devices

## Development

The application uses:
- React 18 with hooks
- React Router for navigation
- Context API for state management
- Fetch API for HTTP requests
- CSS custom properties for theming

## Troubleshooting

1. **CORS Issues**: Ensure backend has CORS configured for `http://localhost:3000`
2. **API Errors**: Check that backend server is running on port 5000
3. **Voice Features**: Ensure browser supports Web Speech API
4. **Build Issues**: Clear node_modules and reinstall dependencies

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Serve the `build` folder with a static file server

3. Update API endpoints for production environment
   
