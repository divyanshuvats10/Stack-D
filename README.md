# Stack'd

Stack'd is a full-stack pizza ordering application. Customers can browse house pizzas, build a custom pizza, add items to a persistent cart, and place an order for delivery.

## Features

- Browse pizzas from the menu
- Build a custom pizza from a base, sauce, cheese, and toppings
- Add standard and custom pizzas to the cart
- Update quantities or remove items from the cart
- Persist the cart in browser `localStorage`
- Validate delivery details before checkout
- Create an order and view its confirmation page
- Recalculate the order total on the server before saving it

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Redux Toolkit and React Redux
- Axios
- React Hook Form and Zod
- Tailwind CSS

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- CORS

## Project Structure

```text
client/
	public/pizzas/       Pizza images
	src/
		api/                Axios configuration
		app/                Redux store
		components/         Shared UI components
		features/cart/      Cart Redux slice
		pages/              Application pages
		utils/              Cart helpers

server/
	config/               Database connection
	controllers/          Request and business logic
	models/               Mongoose schemas
	routes/               Express route definitions
	seed.js               Initial pizza and ingredient data
	index.js              Server entry point
```

## Requirements

- Node.js 18 or later
- A MongoDB database, local or MongoDB Atlas
- npm

## Setup

Clone the repository, then install dependencies in both applications:

```bash
cd server
npm install

cd ../client
npm install
```

Create `server/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/stackd
CLIENT_URL=http://localhost:5173
PORT=5000
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Do not commit either `.env` file or any database credentials.

## Seed the Database

The seed script clears and recreates the `pizzas` and `ingredients` collections:

```bash
cd server
node seed.js
```

Run this only when it is acceptable to delete the existing pizza and ingredient data.

## Run the Application

Start the backend in one terminal:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

Open the Vite URL shown in the terminal, normally:

```text
http://localhost:5173
```

The backend normally runs at:

```text
http://localhost:5000
```

## Application Flow

```text
Home
	-> Menu or Build Your Own
	-> Add pizza to Redux cart
	-> Cart saved to localStorage
	-> Checkout form validated in the browser
	-> POST /api/orders
	-> Server recalculates the total
	-> Cart is cleared after success
	-> Order confirmation loads the saved order
```

The home page is a static landing page. The menu and pizza builder are the first pages that request data from the backend.

## API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/pizzas` | Return all pizzas |
| `GET` | `/api/pizzas/:id` | Return one pizza |
| `GET` | `/api/ingredients` | Return all ingredients |
| `POST` | `/api/orders` | Create an order |
| `GET` | `/api/orders/:id` | Return one order |

## Data Models

### Pizza

```text
name, description, basePrice, image
```

### Ingredient

```text
name, type, price
```

Ingredient types are `base`, `sauce`, `cheese`, and `topping`.

### Order

```text
customerName, phone, address, city, pincode,
items, grandTotal, status, createdAt, updatedAt
```

New orders start with the `Placed` status.

## Useful Commands

From `client/`:

```bash
npm run dev       # Start Vite development server
npm run build     # Create a production build
npm run lint      # Run ESLint
npm run preview   # Preview the production build
```

From `server/`:

```bash
npm run dev       # Start Express with nodemon
node seed.js      # Reset and seed pizza data
```

## Current Limitations

- No authentication or user accounts
- No payment provider integration
- No admin interface for managing orders
- No endpoint for changing order status
- No automated test suite is currently configured
- The server recalculates totals from submitted item prices; a production system should resolve prices from database records instead of trusting client-provided prices