# MarketHub - Multi-Vendor E-Commerce Marketplace

MarketHub is designed as a complete marketplace ecosystem connecting customers, sellers, delivery partners, and administrators.

## Ecosystem Overview

### 🛒 Customers
Customers can discover products from different sellers, compare products, place orders, make secure payments, and track deliveries.

### 🏪 Vendors/Sellers
Vendors receive their own dashboards to manage products, inventory, orders, promotions, and revenue.

### 📦 Delivery Partners
Delivery partners can view assigned deliveries and update delivery status.

### 👨‍💼 Administrators
Administrators have full control over the platform including vendor approvals, product approvals, and platform analytics.

## Features

### Customer Features
- Browse products from multiple vendors
- Advanced search and filtering
- Product details with reviews
- Shopping cart with vendor-wise grouping
- Multi-step checkout with address management
- Order tracking and management
- Wishlist functionality
- Customer dashboard
- Coupon/discount code support

### Vendor Features
- Vendor registration and approval system
- Product management (CRUD operations)
- Inventory management with low-stock alerts
- Order management and processing
- Sales analytics and earnings tracking
- Vendor dashboard with statistics
- Commission-based earnings system

### Admin Features
- Admin dashboard with platform analytics
- Vendor approval workflow
- Product approval workflow
- Order management
- Category management
- Coupon management
- Commission configuration
- Platform revenue tracking

### Technical Features
- RESTful API architecture
- JWT authentication
- Role-based access control (RBAC)
- Multi-vendor order splitting
- Commission calculation system
- Payment simulation
- Email notifications (Nodemailer)
- Image upload support (Multer)
- Responsive design
- Mobile-friendly interface

## Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT (JSON Web Tokens)
- bcrypt (password hashing)
- Multer (file uploads)
- Nodemailer (email)

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Fetch API
- LocalStorage

## Project Structure

```
markethub/
├── backend/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── productController.js # Product CRUD
│   │   ├── categoryController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── ...
│   ├── middleware/
│   │   ├── auth.js              # Authentication middleware
│   │   └── error.js             # Error handling
│   ├── models/                  # (Using raw SQL queries)
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── categories.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   ├── vendors.js
│   │   ├── payments.js
│   │   ├── coupons.js
│   │   ├── reviews.js
│   │   ├── wishlist.js
│   │   ├── notifications.js
│   │   ├── admin.js
│   │   ├── vendor.js
│   │   ├── customer.js
│   │   └── users.js
│   ├── services/                # Business logic
│   ├── utils/
│   │   └── jwt.js               # JWT utilities
│   ├── server.js                # Express server
│   └── package.json
├── frontend/
│   ├── css/
│   │   ├── style.css            # Main styles
│   │   ├── responsive.css       # Responsive styles
│   │   └── dashboard.css        # Dashboard styles
│   ├── js/
│   │   ├── api.js               # API client
│   │   ├── auth.js              # Authentication
│   │   ├── home.js              # Homepage logic
│   │   ├── shop.js              # Shop page logic
│   │   ├── product.js           # Product page logic
│   │   ├── cart.js              # Cart logic
│   │   ├── checkout.js          # Checkout logic
│   │   ├── customer-dashboard.js
│   │   ├── vendor-dashboard.js
│   │   └── admin-dashboard.js
│   ├── index.html               # Homepage
│   ├── shop.html                # Product listing
│   ├── product.html             # Product details
│   ├── cart.html                # Shopping cart
│   ├── checkout.html            # Checkout page
│   ├── login.html               # Login page
│   ├── register.html            # Registration page
│   ├── customer-dashboard.html  # Customer dashboard
│   ├── vendor-dashboard.html    # Vendor dashboard
│   └── admin-dashboard.html     # Admin dashboard
├── database/
│   ├── schema.sql               # Database schema
│   └── seed.sql                 # Sample data
├── uploads/                     # File uploads directory
├── .env.example                 # Environment variables template
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Step 1: Clone the Repository
```bash
cd markethub
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Setup PostgreSQL Database

#### Create Database
```sql
CREATE DATABASE markethub;
```

#### Run Schema
```bash
psql -U postgres -d markethub -f ../database/schema.sql
```

#### Run Seed Data (Optional)
```bash
psql -U postgres -d markethub -f ../database/seed.sql
```

### Step 4: Configure Environment Variables

Copy `.env.example` to `.env` in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=markethub
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=noreply@markethub.com

# Frontend URL
FRONTEND_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### Step 5: Start the Backend Server

```bash
cd backend
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Step 6: Access the Frontend

Open your browser and navigate to:
```
http://localhost:5000
```

The frontend is served by the Express server from the `frontend` directory.

## Demo Credentials

### Admin Accounts
- Email: `admin@markethub.com`
- Password: `password123`

### Customer Accounts
- Email: `rahul@gmail.com`
- Password: `password123`

### Vendor Accounts
- Email: `techworld@gmail.com`
- Password: `password123`

### Delivery Partner Accounts
- Email: `delivery@markethub.com`
- Password: `password123`

**Note:** All demo accounts use the same password: `password123`

## What's New

### ✅ Recently Added Features

1. **Product Images** - All 50 products now have real images from Unsplash
2. **Delivery Partner Dashboard** - Complete delivery management system
3. **Vendor Registration Page** - Dedicated seller registration form
4. **Enhanced Authentication** - Role-based redirects for all user types
5. **Real Password Hashes** - Proper bcrypt hashed passwords for demo accounts

### 📦 Delivery Partner Features
- View delivery assignments
- Update delivery status (Out for Delivery, Delivered)
- Delivery history tracking
- Profile management

### 🏪 Vendor Registration
- Complete business information form
- GST and PAN number fields
- Bank details for payments
- Address information
- Auto-approval workflow

## API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "9876543210",
  "role": "CUSTOMER"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Product Endpoints

#### Get All Products
```http
GET /api/products?category=1&search=laptop&sort=price_low&page=1&limit=20
```

#### Get Product by ID
```http
GET /api/products/:id
```

#### Create Product (Vendor/Admin)
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "vendor_id": 1,
  "category_id": 1,
  "sku": "PROD-001",
  "name": "Product Name",
  "slug": "product-name",
  "description": "Product description",
  "price": 999.99,
  "discount_price": 799.99
}
```

### Cart Endpoints

#### Get Cart
```http
GET /api/cart
Authorization: Bearer <token>
```

#### Add to Cart
```http
POST /api/cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "product_id": 1,
  "quantity": 2
}
```

### Order Endpoints

#### Create Order
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "address_id": 1,
  "payment_method": "COD",
  "coupon_code": "WELCOME10"
}
```

#### Get Orders
```http
GET /api/orders?status=DELIVERED&page=1
Authorization: Bearer <token>
```

### Dashboard Endpoints

#### Admin Dashboard
```http
GET /api/admin/dashboard
Authorization: Bearer <token>
```

#### Vendor Dashboard
```http
GET /api/vendor/dashboard
Authorization: Bearer <token>
```

#### Customer Dashboard
```http
GET /api/customer/dashboard
Authorization: Bearer <token>
```

## User Roles

### CUSTOMER
- Browse products
- Add to cart
- Place orders
- Track orders
- Write reviews
- Manage wishlist
- View order history

### VENDOR
- Register as seller (requires admin approval)
- Add/manage products
- Manage inventory
- View and process orders
- Track earnings
- Request withdrawals

### ADMIN
- Full system access
- Approve/reject vendors
- Approve/reject products
- Manage categories
- Manage coupons
- View all orders
- Configure commissions
- View platform analytics

### DELIVERY_PARTNER
- View assigned deliveries
- Update delivery status

## Multi-Vendor Order System

When a customer places an order with products from multiple vendors, the system automatically:

1. Creates a main order (e.g., MH-10001)
2. Splits the order by vendor
3. Creates vendor-specific sub-orders (e.g., MH-10001-V1, MH-10001-V2)
4. Calculates commission for each vendor
5. Updates inventory for each product
6. Sends notifications to respective vendors

## Commission System

The marketplace earns commission on each sale:

```
Product Price: ₹1,000
Commission Rate: 10%
Platform Earns: ₹100
Vendor Earns: ₹900
```

Commission rates are configurable per vendor.

## Order Status Flow

```
PLACED → CONFIRMED → PROCESSING → SHIPPED → OUT_FOR_DELIVERY → DELIVERED
```

Customers can cancel orders before shipment.

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation
- SQL injection protection (parameterized queries)
- CORS configuration
- File upload validation
- Environment variable configuration

## Development

### Adding New Features

1. **Backend**: Add controllers, routes, and update database schema if needed
2. **Frontend**: Add HTML pages, CSS styles, and JavaScript modules
3. **API**: Update `api.js` with new API methods
4. **Testing**: Test end-to-end flows

### Database Migrations

To modify the database:
1. Create a new SQL migration file
2. Run it against the database
3. Update `schema.sql` for reference

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists

### Port Already in Use
- Change `PORT` in `.env`
- Kill process using port 5000:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F

  # Linux/Mac
  lsof -ti:5000 | xargs kill -9
  ```

### CORS Errors
- Ensure `FRONTEND_URL` in `.env` matches your frontend URL
- Check CORS configuration in `server.js`

## Future Enhancements

- Real-time notifications with WebSocket
- Advanced analytics with charts
- Payment gateway integration (Razorpay, Stripe)
- Advanced search with Elasticsearch
- Product recommendation engine
- Mobile app (React Native)
- Multi-language support
- Advanced vendor analytics
- Automated tax calculation
- Shipping integration

## License

This project is for educational purposes.

## Support

For issues and questions, please create an issue in the repository.

## Acknowledgments

- Built with Node.js, Express, and PostgreSQL
- Inspired by major e-commerce platforms like Amazon and Flipkart
