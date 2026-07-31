# 🛒 ApexCart — Enterprise Full-Stack E-Commerce Platform

A production-ready, enterprise-grade Full Stack E-Commerce Web Application built with Java 21, Spring Boot 3, Spring Security 6, JWT Authentication, Spring Data JPA, MySQL 8, React 19, TypeScript, and Tailwind CSS.

---

## 🌟 Key Features

### 🔐 Authentication & RBAC
- **JWT Access & Refresh Token Architecture**: Stateless security session with automatic silent refresh.
- **BCrypt Password Hashing**: Enterprise standard encryption.
- **Role-Based Access Control (RBAC)**: `ROLE_ADMIN` and `ROLE_CUSTOMER`.
- **User Account Lifecycle**: Registration, Login, Logout, Forgot Password token flow.

### 🛍️ Customer Features
- **Modern Responsive UI**: Dark/Light mode theme system built with Tailwind CSS & Lucide Icons.
- **Hero & Catalogs**: Featured showcase, category pills, new arrivals grid, customer reviews.
- **Live Debounced Search**: Autocomplete drawer searching title, description, category, and brand.
- **Rich Product Detail**: Multi-image preview, variant selector, quantity controls, stock alerts, related products.
- **Cart & Wishlist**: Persistent shopping cart, wishlist manager, coupon code discount validator, automatic tax (8%) & shipping calculations.
- **Multi-Step Checkout**: Saved delivery address manager, interactive payment gateway design selector (Stripe, Razorpay, PayPal, Cash on Delivery).
- **Order Tracking & Invoices**: Real-time visual order status timeline tracker (`PENDING` -> `PROCESSING` -> `SHIPPED` -> `DELIVERED`), downloadable printable invoice text format.

### 📊 Admin Console & Analytics
- **Analytics KPI Dashboard**: Real-time stats cards for Total Revenue, Total Orders, Active Users, Catalog SKUs, Low Stock warnings, and Pending Orders.
- **Interactive Revenue Graph**: Monthly sales trends report visual SVG charts.
- **Catalog Management**: Create/Edit products with instant image upload endpoint integration, variant configuration, category & brand management.
- **Order Management**: Order listing with status filters and single-click order status updaters.
- **Coupons Management**: Create & revoke promo discount codes.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19, Vite, TypeScript |
| **Styling & Icons** | Tailwind CSS, Lucide React Icons |
| **State & API Client** | Context API, Axios (Interceptors) |
| **Backend Framework** | Java 21, Spring Boot 3.3.x |
| **Security & Auth** | Spring Security 6, JWT (JJWT 0.12.x), BCrypt |
| **Database & ORM** | MySQL 8, Spring Data JPA, Hibernate |
| **Validation & Docs** | Bean Validation, Springdoc OpenAPI 3 (Swagger UI) |
| **Containerization** | Docker, Docker Compose, Nginx |

---

## 🚀 Pre-Configured Seed Credentials

The application automatically seeds default accounts and catalog items upon startup (`DataInitializer.java`):

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@ecommerce.com` | `Admin@123` | Full Admin Console & Catalog Management |
| **Customer** | `user@ecommerce.com` | `User@123` | Customer Shopping, Checkout, Wishlist |

### Sample Coupons Included:
- `WELCOME10` — 10% OFF on minimum spend $50
- `SUMMER20` — 20% OFF on minimum spend $100
- `FREESHIP` — $15.00 OFF shipping fee

---

## 🐳 Quick Start with Docker Compose

To launch the complete application stack (MySQL 8 + Spring Boot Backend + Nginx React Frontend):

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/ecommerce-app.git
cd ecommerce-app

# 2. Copy environment file
cp .env.example .env

# 3. Start all services
docker-compose up --build -d
```

Access the application at:
- **Frontend App**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:8080`
- **Swagger Documentation**: `http://localhost:8080/swagger-ui.html`

---

## 💻 Local Development Setup

### 1. Database Setup
Create a MySQL 8 database named `ecommerce_db`:
```sql
CREATE DATABASE ecommerce_db;
```

### 2. Backend Setup (Java 21 + Spring Boot 3)
```bash
cd backend

# Build and run with Maven
mvn spring-boot:run
```
*Note: If MySQL is not running locally, backend fallback to dev mode via `SPRING_PROFILES_ACTIVE=dev`.*

### 3. Frontend Setup (React 19 + Vite + TypeScript)
```bash
cd frontend

# Install dependencies
npm install

# Run Vite dev server
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🌐 API Documentation Reference

Swagger UI is enabled at: `http://localhost:8080/swagger-ui.html`

### Key Endpoints:
- `POST /api/v1/auth/login` — User authentication
- `POST /api/v1/auth/register` — New account registration
- `POST /api/v1/auth/refresh-token` — Silent token refresh
- `GET /api/v1/products` — Paginated catalog with search/filter
- `GET /api/v1/cart` — User shopping cart
- `POST /api/v1/orders` — Place order
- `GET /api/v1/orders/track/{orderNumber}` — Live tracking
- `GET /api/v1/admin/dashboard/stats` — Admin metrics
