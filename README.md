# Dulcinea-Art - MERN Stack Artwork Gallery

A full-stack web application built with React, TypeScript, Node.js, Express, and MongoDB for showcasing artwork from artists around the world.

## Features

### For Artists
- **Artist Registration & Authentication**: Secure JWT-based authentication system
- **Artist Dashboard**: Manage personal artworks, view analytics
- **Artwork Management**: Upload, edit, delete, and manage artwork status (sold/available)
- **Profile Management**: Update bio, contact information, and social media links
- **Image Gallery**: Upload multiple images per artwork with zoom functionality

### For Art Lovers
- **Browse Artworks**: Explore artworks with advanced filtering and search
- **Favorites System**: Save favorite artworks using localStorage
- **Image Protection**: Right-click and download protection for artwork images
- **Contact Artists**: Direct communication with artists for inquiries
- **Zoom Functionality**: Detailed view of artwork with pan and zoom capabilities

### For Administrators
- **Super Admin Panel**: Manage artists and artworks
- **Artist Approval**: Approve/activate artist accounts
- **Content Moderation**: Review and manage all content

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **React Bootstrap** for UI components
- **Framer Motion** for animations
- **React Hook Form** for form management
- **TanStack Query** for data fetching
- **React Zoom Pan Pinch** for image zoom functionality

### Backend
- **Node.js** with TypeScript
- **Express.js** for REST API
- **MySQL** with Sequelize ORM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Nodemailer** with SendGrid for email services
- **Multer** for file uploads
- **Helmet** for security
- **Rate Limiting** for API protection

## Project Structure

```
MERN-artwork/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
├── backend/                 # Node.js Express backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── utils/          # Utility functions
│   │   └── config/         # Configuration files
│   └── uploads/            # File upload directory
└── assets/                 # Original HTML/CSS/JS assets
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MySQL (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MERN-artwork
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   PORT=5000
   
   # MySQL Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=dulcinea_art
   DB_USER=root
   DB_PASSWORD=your-mysql-password
   
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   
   # Email Configuration (SendGrid)
   SENDGRID_API_KEY=your-sendgrid-api-key
   FROM_EMAIL=noreply@dulcinea-art.com
   FROM_NAME=Dulcinea Art
   
   # File Upload
   MAX_FILE_SIZE=5242880
   UPLOAD_PATH=uploads
   
   # CORS
   FRONTEND_URL=http://localhost:5173
   ```

5. **Start the development servers**

   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new artist
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password

### Artworks
- `GET /api/artworks` - Get all artworks (with pagination and filters)
- `GET /api/artworks/:id` - Get single artwork
- `POST /api/artworks` - Create new artwork (Artist only)
- `PUT /api/artworks/:id` - Update artwork
- `DELETE /api/artworks/:id` - Delete artwork
- `GET /api/artworks/artist/:artistId` - Get artworks by artist

## Key Features Implementation

### Image Protection
- Right-click disabled on artwork images
- Drag and drop prevention
- Download protection through CSS and JavaScript

### Zoom Functionality
- Pan and zoom capabilities for detailed artwork viewing
- Multiple image support with gallery navigation
- Touch-friendly controls for mobile devices

### Favorites System
- localStorage-based favorites for non-authenticated users
- Persistent across browser sessions
- Easy toggle functionality

### Responsive Design
- Mobile-first approach
- Bootstrap components for consistent styling
- Optimized for all device sizes

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS configuration
- Helmet for security headers
- Input validation and sanitization

## Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist folder
```

### Backend (Heroku/Railway/DigitalOcean)
```bash
cd backend
npm run build
# Deploy with environment variables
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.