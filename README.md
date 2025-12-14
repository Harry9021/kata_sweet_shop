# Kata Sweet Shop

Welcome to the **Kata Sweet Shop**, a modern full-stack web application designed for managing a boutique sweet shop's inventory, sales, and customer interactions. This system provides a seamless experience for customers to browse and purchase sweets, while offering powerful tools for administrators to manage stock and track sales.

## Key Features

*   **User Authentication**: Secure registration and login with role-based access control (Admin/User).
*   **Product Management**: Admins can create, update, delete, and restock sweet inventory.
*   **Search & Filtering**: diverse filtering options by category, price range, and name.
*   **Order Processing**: Users can purchase items; system tracks stock levels automatically.
*   **Sales Analytics**: Admin dashboard for viewing total revenue and order history.
*   **Responsive Design**: Built with React and modern CSS for a fluid experience across devices.

## Tech Stack

**Frontend**
*   **React**: UI Library
*   **Vite**: Build Tool
*   **TypeScript**: Type Safety
*   **Context API**: State Management
*   **React Router**: Navigation

**Backend**
*   **Node.js & Express**: API Server
*   **TypeScript**: Application Logic
*   **MongoDB & Mongoose**: Database & ORM
*   **Jest & Supertest**: Testing Framework
*   **JWT**: Authentication

## Architecture

The application follows a standard Client-Server architecture. The Frontend consumes RESTful APIs provided by the Backend, which interacts with the MongoDB database.

```mermaid
graph TD
    subgraph Actors
        Admin((Admin))
        Customer((User))
    end

    subgraph Client_Side
        UI[Frontend UI]
    end

    subgraph Server_Side
        API[Backend API]
        Auth[Auth Middleware]
        Sweet[Sweet Controller]
        Order[Order Controller]
    end

    subgraph Database
        DB[(MongoDB)]
    end

    %% Admin Privileges
    Admin -->|Login| UI
    Admin -->|Create/Update/Delete Sweets| UI
    Admin -->|Restock Inventory| UI
    Admin -->|View All Sales| UI

    %% User Privileges
    Customer -->|Login| UI
    Customer -->|Browse & Search| UI
    Customer -->|Purchase Sweets| UI
    Customer -->|View My Orders| UI

    %% Data Flow
    UI -->|HTTPS Request| API

    API -->|/api/auth| Auth
    API -->|/api/sweets| Sweet
    API -->|/api/orders| Order

    Auth -->|Verify Credentials| DB

    %% Access Control
    Sweet -->|Public: Read| DB
    Sweet -.->|Admin Only: Write/Update| DB
    
    Order -->|User: Create| DB
    Order -.->|Admin Only: Read All| DB
```

## Screenshots

### Authentication
| Login Page | Registration Page |
|:---:|:---:|
| ![Login Page](screenshots/login.png) | ![Registration Page](screenshots/registration.png) |

### User Experience
| Home Page | Dashboard |
|:---:|:---:|
| ![Home Page](screenshots/homepageAdmin.png) | ![Dashboard](screenshots/dashboardAdmin.png) |

### Administration
| Sales Analytics | Order Management |
|:---:|:---:|
| ![Sales Page](screenshots/salespageAdmin.png) | ![Orders Page](screenshots/orderPage.png) |

### Creation and Purchase
| Creation Popup | Purchase Popup |
|:---:|:---:|
| ![Creation Popup](screenshots/createItem.png) | ![Purchase Popup](screenshots/purchasePopup.png) |


### Quality Assurance
| Testing Reports |
|:---:|
| ![Testing Reports 1](screenshots/testing1.png) | ![Testing Reports 2](screenshots/testing2.png) |

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
*   Node.js (v16 or higher)
*   MongoDB (Local running instance or Atlas URI)

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Harry9021/kata_sweet_shop.git
    cd kata_sweet_shop
    ```

2.  **Setup Backend**
    ```bash
    cd backend
    npm install
    
    cp .env.example .env
    
    # Start Server
    npm run dev
    ```

3.  **Setup Frontend**
    ```bash
    cd ../frontend
    npm install
    
    cp .env.example .env
    
    # Start Client
    npm run dev
    ```

## 🧪 Testing

The backend is fully tested using Jest and Supertest.

```bash
cd backend
npm test
```

## 🛡️ Security

*   Data encryption for sensitive information.
*   JWT-based session management.
*   Input validation and sanitization using `express-validator`.

---
*Built with By Harry9021 for the Kata Sweet Shop Project.*
