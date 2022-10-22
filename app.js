const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const PORT = process.env.PORT || 3000;

const blogSchema = {
  title: String,
  content: String,
};

const articles = mongoose.model("articles", blogSchema);

app.get("/", (res, req) => {
  req.send("<h1>Hello WikiApi<h1>");
});

app.listen(PORT, () => {
  console.log(`Server 🚀 starting on port ${PORT}`);
});
