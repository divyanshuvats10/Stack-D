require("dotenv").config();
const mongoose = require("mongoose");

const removeTemplates = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const result = await mongoose.connection.collection("users").updateMany(
      { pizzaTemplates: { $exists: true } },
      { $unset: { pizzaTemplates: "" } }
    );
    console.log(`Removed pizza templates from ${result.modifiedCount} user(s).`);
  } finally {
    await mongoose.disconnect();
  }
};

removeTemplates().catch((err) => {
  console.error(err.message);
  process.exitCode = 1;
});