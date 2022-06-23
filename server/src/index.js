require("dotenv").config();

const express = require("express");
const cors = require("cors");

require("./db/mongoose");

const authMiddleware = require("./middleware/auth");

const authRoute = require("./routes/auth");
const eventsRoute = require("./routes/events");

const app = express();
app.use(cors());

app.use(express.json());

app.use("/auth", authRoute);
app.use("/events", authMiddleware, eventsRoute);

// Error handler
app.use((err, req, res, next) => {
  // console.log(JSON.parse(JSON.stringify(err)))

  if (err.errors) {
    // Handle mongoose errors
    const errors = Object.values(err.errors).map((errorObj) => errorObj.message);
    res.status(400).json({
      error: errors[0],
    });
  } else {
    // Handle general errors
    res.status(err.statusCode || 400).json({
      error: err.message,
    });
  }
});

const port = process.env.port || 4000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
