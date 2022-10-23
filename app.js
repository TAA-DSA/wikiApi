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

app
  .route("/articles")

  .get((req, res) => {
    articles.find({}, (err, results) => {
      if (!err) {
        res.send(results);
      } else {
        res.send(err);
      }
    });
  })

  .post((req, res) => {
    const newArticle = new articles({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save((err) => {
      if (!err) {
        res.send("Succesfully added a new article");
      } else {
        res.send(err);
      }
    });
  })

  .delete((req, res) => {
    articles.deleteMany({}, (err) => {
      if (!err) {
        res.send("Items deleted successfully");
      } else {
        res.send(err);
      }
    });
  });

app
  .route("/articles/:articleTitle")

  .get((req, res) => {
    articles.findOne(
      { title: req.params.articleTitle },
      (err, foundArticle) => {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No article found matching the search Query!!");
        }
      }
    );
  })

  .put((req, res) => {
    articles.findOneAndUpdate(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      (err) => {
        if (!err) {
          res.send("Successful updated article");
        } else {
          res.send("Err preventing updates, please try again !!");
        }
      }
    );
  })

  .patch((req, res) => {
    articles.findOneAndUpdate(
      { title: req.params.articleTitle },
      { $set: req.body },
      (err) => {
        if (!err) {
          res.send("Successfuly updated !!");
        } else {
          res.send("Err preventing updates");
        }
      }
    );
  })
  .delete((req, res) => {
    articles.deleteOne({ title: req.params.articleTitle }, (err) => {
      if (!err) {
        res.send("Article successfully deleted !!");
      } else {
        res.send("Err, article cannot be deleted !!!");
      }
    });
  });

app.listen(PORT, () => {
  console.log(`Server 🚀 starting on port ${PORT}`);
});
