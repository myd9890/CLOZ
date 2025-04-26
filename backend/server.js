const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");

const { Server } = require("socket.io");
const app = express();

require("dotenv").config();
const customerRoutes = require("./routes/customerRoutes");
//const loyaltyRoutes = require("./routes/loyaltyRoutes");
const employeeRoutes = require("./routes/employees");
const authRoutes = require("./routes/auth");
const attendanceRoutes = require("./routes/attendance");
const salaryRoutes = require("./routes/salary");
const requestRoutes = require("./routes/requests");

const PORT = process.env.PORT || 8070;

console.log("MongoDB URL:", process.env.MONGODB_URL); // Add this line to check the MongoDB URL

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const URL = process.env.MONGODB_URL;

mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Mongodb connection success!");
});

app.use("/api/customers", customerRoutes);
app.use("/emails", customerRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("A client disconnected:", socket.id);
  });
});

global.io = io;
const supplier = require("./routes/supplier_route");

app.use("/supplier", supplier);

const product = require("./routes/product_route");

app.use("/products", product);

const orderRoutes = require("./routes/supplierorder_route");

app.use("/order", orderRoutes);

const salesRoutes = require("./routes/sales_route");
app.use("/sale", salesRoutes);

app.use("/customers", customerRoutes);

//app.use("/api/loyalty", loyaltyRoutes);
const assetRouter = require("./routes/Assets.js");
app.use("/assets", assetRouter);

const liabilityRouter = require("./routes/Liabilities.js");
app.use("/liabilities", liabilityRouter);

const expenseRouter = require("./routes/Expenses.js");
app.use("/expenses", expenseRouter);

const pettyRouter = require("./routes/pettyCashexp.js");
app.use("/pettycash", pettyRouter);

const incomeRouter = require("./routes/Incomes.js");
app.use("/incomes", incomeRouter);

app.use("/api/employees", employeeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/requests", requestRoutes);

server.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});
