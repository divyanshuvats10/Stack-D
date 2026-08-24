require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use("/api/pizzas", require("./routes/pizzaRoutes"));
app.use("/api/ingredients", require("./routes/ingredientRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
	await connectDB();
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();