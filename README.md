# 🍔 Foodie – Online Food Delivery Application

Foodie is a Zomato/Swiggy-inspired online food delivery application developed using **Java and Spring Boot**. The application allows customers to discover restaurants, view menus, manage their cart, place orders, make payments, and manage delivery locations.

The application follows a **layered architecture** using Controller, Service, Repository, and Entity layers.

---

## 📌 Project Overview

The main objective of Foodie is to provide an online platform where customers can:

- Register and log in
- Browse restaurants
- View restaurant menus
- Add food items to a cart
- Place food orders
- Make online payments
- Manage delivery locations
- Track order status

The application also provides functionality for restaurant and admin management.

---

## 👥 Major Modules

### 1. Customer Module

Customers can:

- Register and log in
- Browse restaurants
- Search/view restaurants
- View menus
- Select food items
- Manage cart items
- Place orders
- Make payments
- Manage delivery location

### 2. Restaurant Module

Restaurant owners can:

- Manage restaurant information
- Add menu items
- Update menu items
- Manage menu variants
- Manage food availability/inventory

### 3. Admin Module

The Admin is responsible for managing the overall application and its data.

Admin functionality includes:

- Managing users
- Managing restaurants
- Managing application data
- Monitoring overall system operations

---

## 🏗️ Architecture

Foodie follows a layered backend architecture:

```text
                    Frontend
                       |
                       ↓
                REST API / HTTP
                       |
                       ↓
                 Controller
                       |
                       ↓
                   Service
                       |
                       ↓
                  Repository
                       |
                       ↓
                JPA / Hibernate
                       |
                       ↓
                    MySQL
```

### Controller Layer

Handles incoming HTTP requests and sends responses to the client.

### Service Layer

Contains the application's business logic and validations.

### Repository Layer

Handles database operations using Spring Data JPA.

### Entity Layer

Represents the application's database entities and their relationships.

---

## 🛠️ Technologies Used

### Backend

- Java
- Spring Boot
- Spring MVC
- REST APIs
- Spring Data JPA
- Hibernate
- Spring Security
- JWT

### Frontend

- HTML
- CSS
- JavaScript
- Bootstrap

### Database

- MySQL

### Development & Testing

- IntelliJ IDEA / Eclipse
- VS Code
- Maven
- Git / GitHub
- Postman

### Additional Integrations

- Payment Gateway Integration
- Map / Location Integration

---

## 🔐 Authentication & Authorization

Spring Security and JWT are used for securing the application.

### Authentication Flow

```text
User Login
    ↓
Credentials Validation
    ↓
Authentication Successful
    ↓
JWT Token Generated
    ↓
Token Sent to Client
    ↓
Client Sends JWT with Requests
    ↓
Server Validates Token
    ↓
Protected API Access
```

Role-based authorization can be used to provide different permissions to:

- Customer
- Restaurant Owner
- Admin

---

## 🔄 REST API Flow

Example: Adding a Restaurant

```text
Frontend
   ↓
POST /restaurant
   ↓
RestaurantController
   ↓
RestaurantService
   ↓
RestaurantRepository
   ↓
Hibernate / JPA
   ↓
MySQL
```

The response is then returned back to the frontend as JSON.

---

## 🗄️ Database

MySQL is used as the relational database.

The application uses JPA/Hibernate to map Java entities to database tables.

Example entity relationships:

```text
Restaurant
    |
    ├── Address
    |
    └── Menu Items
          |
          └── Menu Variants
```

Common relationship types used in the application include:

- One-to-One
- One-to-Many
- Many-to-One

---

## 🍕 Order Workflow

The general order workflow is:

```text
Select Restaurant
       ↓
View Menu
       ↓
Select Food Items
       ↓
Add to Cart
       ↓
Checkout
       ↓
Payment
       ↓
Payment Verification
       ↓
Order Confirmation
       ↓
Order Processing
       ↓
Delivery
```

An order should be confirmed only after successful payment verification.

---

## 💳 Payment

The application includes payment integration as part of the order workflow.

The basic flow is:

```text
Create Order
     ↓
Initiate Payment
     ↓
Payment Gateway
     ↓
Payment Verification
     ↓
Successful → Confirm Order
     ↓
Failed → Payment Failed / Retry
```

---

## 📍 Location / Map Integration

The application supports location-related functionality using map/location integration.

Location information such as **latitude and longitude** can be used for delivery location management and location-based restaurant discovery.

---

## ✅ Validation & Exception Handling

The application uses validation to verify incoming request data.

Exception handling is used for situations such as:

- Invalid requests
- Resource not found
- Duplicate records
- Database-related errors
- Authentication/authorization errors

Global exception handling can be used to return meaningful API responses instead of exposing internal application errors.

---

## 🧪 API Testing

REST APIs can be tested using **Postman**.

The following HTTP methods are used:

| Method | Purpose |
|---|---|
| GET | Retrieve data |
| POST | Create data |
| PUT | Update data |
| DELETE | Delete data |

Example:

```text
GET     → Get restaurants
POST    → Add restaurant
PUT     → Update restaurant
DELETE  → Delete restaurant
```

---

## 🚀 How to Run the Project

### Prerequisites

Install:

- Java
- Maven
- MySQL
- IDE such as IntelliJ IDEA or Eclipse
- Postman

### Step 1 – Clone the Repository

```bash
git clone <your-github-repository-url>
```

### Step 2 – Open the Project

Open the project in IntelliJ IDEA or another Java IDE.

### Step 3 – Configure MySQL

Create a MySQL database and update the database configuration in:

```text
src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/foodie
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Use your actual database username and password.

### Step 4 – Install Dependencies

Using Maven:

```bash
mvn clean install
```

### Step 5 – Run the Application

Run the Spring Boot main class from your IDE.

Or use:

```bash
mvn spring-boot:run
```

### Step 6 – Test APIs

Open Postman and send requests to the application's configured API URL.

Example:

```text
http://localhost:8080/
```

Use the actual port configured in your project.

---

## 📂 Project Structure

```text
Foodie
│
├── src
│   └── main
│       ├── java
│       │   └── ...
│       │       ├── controller
│       │       ├── service
│       │       ├── repository
│       │       ├── entity
│       │       ├── dto
│       │       ├── exception
│       │       └── config
│       │
│       └── resources
│           └── application.properties
│
├── pom.xml
└── README.md
```

---

## 🎯 Key Features

- Customer management
- Restaurant management
- Admin management
- Menu management
- Menu variants
- Cart management
- Order management
- Payment integration
- JWT authentication
- Role-based authorization
- MySQL database
- REST APIs
- Location/map integration
- Validation
- Exception handling

---

## 🔮 Future Enhancements

Possible future improvements include:

- Real-time delivery tracking
- Advanced food recommendations
- Restaurant ratings and reviews
- Push notifications
- Coupon and discount management
- Improved admin dashboard
- Advanced analytics
- Mobile application

---

## 👨‍💻 Project Skills Demonstrated

This project demonstrates practical knowledge of:

- Core Java
- Object-Oriented Programming
- Spring Boot
- REST API development
- Spring Data JPA
- Hibernate
- MySQL
- Spring Security
- JWT authentication
- Database relationships
- Exception handling
- API testing
- Frontend-backend integration

---

## 📌 Project Summary

**Foodie** demonstrates how a real-world food delivery application can be developed using Java and Spring Boot. It combines REST API development, database management, authentication, authorization, order processing, payment integration, and location-based functionality into a single application.
