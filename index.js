const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 8080;

// Schema
const schemaData = new mongoose.Schema({
  name: String,
  email: String,
  mobile: Number,
}, {
  timestamps: true
});

const userModel = mongoose.model("user", schemaData);

// Read
app.get("/", async (req, res) => {
  const data = await userModel.find({});
  res.json({ success: true, data: data });
});

// Create data
app.post("/create", async (req, res) => {
  console.log(req.body);
  const data = new userModel(req.body);
  await data.save();
  res.send({ success: true, message: "Data saved successfully", data: data });
});

// Update data
app.put("/update", async (req, res) => {
  console.log(req.body);
  const { _id, ...rest } = req.body;

  console.log(rest);
  const data = await userModel.findByIdAndUpdate(_id, { $set: rest }, { new: true });
  res.send({ success: true, message: "Data updated successfully", data: data });
});

// Delete data
app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const data = await userModel.deleteOne({ _id: id });
  res.send({ success: true, message: "Data deleted successfully", data: data });
});

mongoose.connect("mongodb://127.0.0.1:27017/company")
  .then(() => {
    console.log("Connected to DB");
    app.listen(PORT, () => console.log("Server is running on port", PORT));
  })
  .catch((err) => console.log(err));
