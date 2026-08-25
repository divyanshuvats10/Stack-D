require("dotenv").config();
const mongoose = require("mongoose");
const dns = require("dns");

const dnsServers = process.env.MONGO_DNS_SERVERS?.split(",").map((server) => server.trim()).filter(Boolean);
if (dnsServers?.length) dns.setServers(dnsServers);

const removePizzaCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const result = await mongoose.connection.collection("pizzas").updateMany(
      { category: { $exists: true } },
      { $unset: { category: "" } }
    );
    console.log(`Removed category from ${result.modifiedCount} pizza(s).`);
  } finally {
    await mongoose.disconnect();
  }
};

removePizzaCategories().catch((err) => {
  console.error(err.message);
  process.exitCode = 1;
});
