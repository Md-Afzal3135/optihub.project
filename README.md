# 🕶️ OptiHub — Premium Eyewear E-Commerce Store

**OptiHub** is a modern, full-stack e-commerce web application for premium eyewear — built with **Django REST Framework** on the backend and **React** on the frontend. Browse products by category, search and sort, add items to a persistent cart, place orders, and track order history — all with a sleek, responsive UI inspired by Lenskart.

---

## ✨ Features

| Area              | Details                                                                 |
|-------------------|-------------------------------------------------------------------------|
| **Authentication** | Email-based registration & login with JWT (access + refresh tokens)    |
| **Product Catalog**| Browse, search, and sort products; filter by category                  |
| **Product Detail** | Individual product page with image, description, price, and add-to-cart|
| **Shopping Cart**  | Add, update quantity, remove items; persistent per-user cart           |
| **Checkout**       | Enter shipping address and place order from cart                      |
| **Order History**  | View all past orders with status tracking (Pending → Delivered)       |
| **Admin Panel**    | Django Admin for managing users, products, categories, and orders     |
| **Responsive UI**  | Fully responsive design optimized for desktop and mobile              |

---

## 🛠️ Tech Stack

### Backend
- **Python 3.8+**
- **Django 5.x** & **Django REST Framework**
- **Simple JWT** — token-based authentication
- **PostgreSQL** — primary database
- **django-cors-headers** — cross-origin request handling
- **Pillow** — image processing for product photos

### Frontend
- **React 19** (Create React App)
- **React Router v7** — client-side routing
- **Axios** — HTTP client for API communication
- **Context API** — global state management (Auth & Cart)
- **Custom CSS** — hand-crafted styles, no UI library dependency

---

## 📂 Project Structure

```
optihub.project/
│
├── backend/                   # Django project configuration
│   ├── settings.py            # Project settings (DB, JWT, CORS, etc.)
│   ├── urls.py                # Root URL configuration
│   └── wsgi.py                # WSGI entry point
│
├── users/                     # User authentication & profiles
│   ├── models.py              # Custom User model (email-based login)
│   ├── views.py               # Register, Login (JWT), Profile views
│   ├── serializers.py         # User & Registration serializers
│   └── urls.py                # /api/users/ routes
│
├── products/                  # Product catalog management
│   ├── models.py              # Category & Product models
│   ├── views.py               # CRUD ViewSets with search & ordering
│   ├── serializers.py         # Category & Product serializers
│   └── urls.py                # /api/products/ routes
│
├── orders/                    # Cart & order management
│   ├── models.py              # Cart, Order, OrderItem models
│   ├── views.py               # Cart CRUD, Place Order, Order History
│   ├── serializers.py         # Cart & Order serializers
│   └── urls.py                # /api/orders/ routes
│
├── media/                     # Uploaded product images
├── manage.py                  # Django management script
│
└── frontend/                  # React application
    ├── public/                # Static assets & index.html
    └── src/
        ├── api/               # Axios instance configuration
        ├── assets/            # Images & static resources
        ├── components/        # Reusable UI components
        │   ├── Navbar.js      # Navigation bar with auth-aware links
        │   └── Footer.js      # Site footer
        ├── context/           # React Context providers
        │   ├── AuthContext.js  # Authentication state & JWT management
        │   └── CartContext.js  # Shopping cart state management
        ├── pages/             # Page components
        │   ├── Home.js        # Landing page
        │   ├── ProductList.js # Product catalog with search & filters
        │   ├── ProductDetail.js # Single product view
        │   ├── Login.js       # User login form
        │   ├── Register.js    # User registration form
        │   ├── Cart.js        # Shopping cart page
        │   ├── Checkout.js    # Order placement page
        │   └── Orders.js      # Order history page
        ├── routes/            # Route definitions
        ├── App.js             # Root component with routing
        └── App.css            # Global styles
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.8+**
- **Node.js 18+** & **npm**
- **PostgreSQL** (or switch to SQLite for quick dev setup)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/optihub.git
cd optihub.project
```

### 2️⃣ Backend Setup

```bash
# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # macOS / Linux
# venv\Scripts\activate         # Windows

# Install Python dependencies
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers pillow psycopg2-binary
```

#### Configure the Database

Make sure PostgreSQL is running and create the database:

```bash
createdb optihub_db
```

> **Tip:** To use **SQLite** instead (no PostgreSQL needed), replace the `DATABASES` block in `backend/settings.py` with:
> ```python
> DATABASES = {
>     'default': {
>         'ENGINE': 'django.db.backends.sqlite3',
>         'NAME': BASE_DIR / 'db.sqlite3',
>     }
> }
> ```

#### Run Migrations & Create Superuser

```bash
python manage.py migrate
python manage.py createsuperuser
```

#### Start the Backend Server

```bash
python manage.py runserver
```

The API will be available at **http://localhost:8000/**.

---

### 3️⃣ Frontend Setup

Open a **new terminal**:

```bash
cd frontend
npm install
npm start
```

The React app will be available at **http://localhost:3000/**.

---

## 🔌 API Reference

### Authentication (`/api/users/`)

| Method | Endpoint                  | Description                | Auth Required |
|--------|---------------------------|----------------------------|:------------:|
| POST   | `/api/users/register/`    | Register a new user        | ❌           |
| POST   | `/api/users/login/`       | Login (returns JWT tokens) | ❌           |
| POST   | `/api/users/token/refresh/`| Refresh access token      | ❌           |
| GET    | `/api/users/profile/`     | Get current user profile   | ✅           |

### Products (`/api/products/`)

| Method | Endpoint                          | Description                     | Auth Required |
|--------|-----------------------------------|---------------------------------|:------------:|
| GET    | `/api/products/`                  | List all products (search/sort) | ❌           |
| GET    | `/api/products/{id}/`             | Get product detail              | ❌           |
| POST   | `/api/products/`                  | Create a product                | ✅ Admin     |
| PUT    | `/api/products/{id}/`             | Update a product                | ✅ Admin     |
| DELETE | `/api/products/{id}/`             | Delete a product                | ✅ Admin     |
| GET    | `/api/products/categories/`       | List all categories             | ❌           |
| POST   | `/api/products/categories/`       | Create a category               | ✅ Admin     |

**Search & Sort Query Parameters:**
- `?search=sunglasses` — search by name, description, or category
- `?ordering=price` — sort by `price`, `name`, or `created_at` (prefix `-` for descending)

### Cart (`/api/orders/cart/`)

| Method | Endpoint                    | Description                | Auth Required |
|--------|-----------------------------|----------------------------|:------------:|
| GET    | `/api/orders/cart/`         | View cart items & total    | ✅           |
| POST   | `/api/orders/cart/add/`     | Add item to cart           | ✅           |
| PUT    | `/api/orders/cart/{id}/`    | Update cart item quantity  | ✅           |
| DELETE | `/api/orders/cart/{id}/`    | Remove item from cart      | ✅           |

### Orders (`/api/orders/`)

| Method | Endpoint                | Description              | Auth Required |
|--------|-------------------------|--------------------------|:------------:|
| GET    | `/api/orders/`          | List user's orders       | ✅           |
| POST   | `/api/orders/`          | Place a new order        | ✅           |
| GET    | `/api/orders/{id}/`     | Get order detail         | ✅           |

---

## 🗃️ Data Models

### User (Custom — email-based login)
| Field    | Type         | Notes                    |
|----------|--------------|--------------------------|
| email    | EmailField   | Primary login identifier |
| username | CharField    | Required                 |
| name     | CharField    | Optional display name    |

### Product
| Field       | Type          | Notes                        |
|-------------|---------------|------------------------------|
| name        | CharField     | Max 300 characters           |
| description | TextField     | Optional                     |
| price       | DecimalField  | Up to 10 digits, 2 decimal   |
| image       | ImageField    | Uploaded to `media/products/`|
| category    | ForeignKey    | Links to Category            |

### Order
| Field       | Type          | Notes                                               |
|-------------|---------------|------------------------------------------------------|
| user        | ForeignKey    | The ordering user                                    |
| total_price | DecimalField  | Calculated at order time                             |
| status      | CharField     | `pending` · `processing` · `shipped` · `delivered` · `cancelled` |
| address     | TextField     | Shipping address                                     |

---

## 🖥️ Frontend Pages

| Route             | Page             | Description                                 |
|-------------------|------------------|---------------------------------------------|
| `/`               | Home             | Landing page with featured products & hero  |
| `/products`       | Product List     | Full catalog with search, sort, and filters |
| `/products/:id`   | Product Detail   | Single product with add-to-cart action      |
| `/login`          | Login            | User login form                             |
| `/register`       | Register         | New user registration                       |
| `/cart`           | Cart             | View and manage cart items                  |
| `/checkout`       | Checkout         | Enter address and place order               |
| `/orders`         | Orders           | View order history and status               |

---

## 🔐 Authentication Flow

1. **Register** — `POST /api/users/register/` → returns user data + JWT tokens
2. **Login** — `POST /api/users/login/` with `email` & `password` → returns `access` + `refresh` tokens
3. **Authenticated Requests** — include `Authorization: Bearer <access_token>` header
4. **Token Refresh** — `POST /api/users/token/refresh/` with `refresh` token when access token expires

---

## 🛡️ Admin Panel

Access the Django admin at **http://localhost:8000/admin/** to manage:

- **Users** — view, create, edit user accounts
- **Categories** — organize products (e.g., Sunglasses, Eyeglasses, Lenses)
- **Products** — add/edit products with images, prices, descriptions
- **Orders** — view and update order statuses

---

## 📋 Environment Notes

| Setting              | Default Value     | Notes                                    |
|----------------------|-------------------|------------------------------------------|
| `DEBUG`              | `True`            | Set to `False` in production             |
| `SECRET_KEY`         | Insecure default  | **Change in production!**                |
| `CORS_ALLOW_ALL`     | `True`            | Restrict in production                   |
| `JWT Access Lifetime`| 1 day             | Configurable in `settings.py`            |
| `JWT Refresh Lifetime`| 7 days           | Configurable in `settings.py`            |
| `TIME_ZONE`          | `Asia/Kolkata`    | Change as needed                         |

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ using Django & React
</p>
