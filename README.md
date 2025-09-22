# Car Rental System
A modern car rental web application with user authentication, car booking, and rental management. Built with Express.js, MongoDB, and session-based authentication.

## Features

- **User Authentication** - Login and automatic account creation
- **Car Browsing** - View available cars with images and details
- **Booking System** - Reserve cars with return date selection
- **Rental Management** - Return rented cars and track availability
- **Session Security** - Protected routes and user authorization
- **Responsive Design** - Modern UI with Tailwind CSS and daisyUI

## Tech Stack

| Category | Technology |
|----------|------------|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Authentication** | express-session |
| **Frontend** | EJS Templates, HTML5 |
| **Styling** | Tailwind CSS, daisyUI |
| **Deployment** | Vercel |

## Quick Start

1. **Clone and install**
   ```bash
   git clone <your-repository-url>
   cd car-rental-system
   npm install
   ```

2. **Configure environment**
   ```bash
   # Create .env file with your MongoDB connection string
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   ```

3. **Start the application**
   ```bash
   npm start
   ```

Visit `http://localhost:3000` to access the application.

## How It Works

### Authentication Flow
- **New Users**: Enter email/password to automatically create account
- **Existing Users**: Login with existing credentials
- **Session Management**: Secure session-based authentication
- **Protected Routes**: Unauthorized users redirected to login

### Car Rental Process
1. **Browse Cars** - View all available vehicles with photos
2. **Book a Car** - Select return date and confirm booking
3. **Manage Rentals** - View your rented cars and return dates
4. **Return Cars** - End rental and make car available again

## Database Schema

### Cars Collection
```javascript
{
  model: "Tesla Model Y",           // Car name/model
  imageUrl: "https://...",          // Car image URL
  returnDate: "2024-01-15",         // Return date (empty if available)
  rentedBy: ObjectId               // User ID (null if available)
}
```

### Users Collection
```javascript
{
  email: "user@example.com",       // User email (unique)
  password: "hashed_password"       // User password
}
```

## API Endpoints

### Authentication
| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/` | Login page |
| `POST` | `/login` | Process login/registration |
| `POST` | `/logout` | Logout user |

### Car Management
| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/cars` | List all cars (protected) |
| `GET` | `/book/:id` | Booking form for specific car |
| `POST` | `/book/:id` | Process car booking |
| `POST` | `/return/:id` | Return a rented car |

## Authorization Rules

### Public Access
- Login page (`/`)

### Authenticated Users Only
- Cars list page (`/cars`)
- Car booking (`/book/:id`)
- Car return (`/return/:id`)

**Note**: Unauthorized access automatically redirects to login page.

## Car Status Display

Cars are displayed differently based on their rental status:

- **Available Cars**: Show "BOOK CAR" button
- **Your Rentals**: Show return date and "RETURN" button  
- **Rented by Others**: Show "Unavailable until [date]"

## Setup Instructions

### MongoDB Configuration
1. **Create MongoDB database** (MongoDB Atlas recommended)
2. **Add connection string** to environment variables
3. **Database auto-populates** with 5 sample cars on startup

### Environment Variables
Create a `.env` file:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/carrentals
SESSION_SECRET=your-secure-session-secret
PORT=3000
```

### Dependencies
```bash
npm install express express-session mongodb ejs dotenv
npm install --save-dev tailwindcss daisyui
```

## Development

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build CSS (if needed)
npm run build-css
```

### Sample Data
The application automatically creates 5 sample cars:
- Tesla Model Y
- Honda Civic
- BMW 3 Series
- Toyota Camry
- Ford Mustang

## Deployment

### Vercel Deployment
1. **Connect repository** to Vercel
2. **Add environment variables** in Vercel dashboard
3. **Deploy automatically** on push to main branch

### Environment Variables for Production
- `MONGODB_URI` - Your MongoDB connection string
- `SESSION_SECRET` - Secure session secret key

## Security Features

- **Session-based authentication** with secure cookies
- **Route protection** for authenticated users only
- **Automatic account creation** for new email addresses
- **Password storage** (implement hashing as needed)
- **User isolation** - users can only manage their own rentals


---

**Built with Node.js and MongoDB for reliable car rental management**
