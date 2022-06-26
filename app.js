const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(
  "mongodb+srv://mahuac:Tripura123@cluster1.shvikri.mongodb.net/wikiDB"
);

const articleSchema = mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleSchema);

//chained route handlers using express

app
  .route("/article")
  .get(function (req, res) {
    Article.find({}, function (err, foundArticle) {
      console.log(foundArticle);
      if (!err) {
        res.send(foundArticle); //We are just sending the data into the client. Here are creating only the API
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    const newTitle = req.body.title;
    const newContent = req.body.content;

    const newArticle = new Article({
      title: newTitle,
      content: newContent,
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully added a new article");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (res, req) {
    Article.deleteMany(function (err) {
      if (err) {
        res.send(err);
      } else {
        console.log("Deleted...");
        res.send("Succssfully deleted all the articles");
      }
    });
  });

app
  .route("/article/:articleTitle")

  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (!err) {
          res.send(foundArticle);
        } else {
          res.send("No articles matching for this specific article title");
        }
      }
    );
  })
  .put(function (req, res) {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err, foundArticle) {
        if (!err) {
          res.send("Successfully Updated the document");
        } else {
          res.send("No articles matching to update");
        }
      }
    );
  })
  .patch(function (req, res) {
    Article.findOneAndUpdate(
      {
        title: req.params.articleTitle,
      },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("Successfully Updated the document");
        } else {
          res.send("No articles matching to update");
        }
      }
    );
  })
  .delete(function (req, res) {
    Article.findOneAndDelete(
      {
        title: req.params.articleTitle,
      },
      function (err) {
        if (!err) {
          res.send("Successfully deleted the document");
        } else {
          res.send("No articles matching to update");
        }
      }
    );
  });

app.listen("3000", function () {
  console.log("Server is running successfully");
});

/*
app.get("/article", function (req, res) {
  Article.find({}, function (err, foundArticle) {
    console.log(foundArticle);
    if (!err) {
      res.send(foundArticle); //We are just sending the data into the client. Here are creating only the API
    } else {
      res.send(err);
    }
  });
});

app.post("/article", function (req, res) {
  const newTitle = req.body.title;
  const newContent = req.body.content;

  const newArticle = new Article({
    title: newTitle,
    content: newContent,
  });
  newArticle.save(function (err) {
    if (!err) {
      res.send("Successfully added a new article");
    } else {
      res.send(err);
    }
  });
});

app.delete("/article", function (res, req) {
  Article.deleteMany(function (err) {
    if (!err) {
      res.send("Succssfully deleted all the articles");
    } else {
      res.send(err);
    }
  });
});
*/
