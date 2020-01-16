const express = require("express");
const Posts = require("./postDb.js");

const router = express.Router();

//GET for all posts -- tested and working
router.get("/", (req, res) => {
  Posts.get()
    .then(allPosts => {
      res.status(200).json(allPosts);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ err: "error on server side" });
    });
});

//GET for one post -- tested and working
router.get("/:id", (req, res) => {
  const id = req.params.id;
  Posts.getById(id)
    .then(post => {
      if (!id) {
        res.status(404).json({ errorMessage: "no post by that ID" });
      } else {
        res.status(200).json(post);
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ err: "error on server side" });
    });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  Posts.getById(id)
    .then(deleted => {
      if (!id) {
        res.status(404).json({
          message: "The post with the specified ID does not exist."
        });
      } else {
        Posts.remove(id).then(res.status(200).json(deleted));
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ err: "error on server side" });
    });
});

router.put("/:id", (req, res) => {
  const updateId = req.params.id;
  const { text } = req.body;

  Posts.update(updateId, validatePostId, req.body)
    .then(updated => {
      if (!text) {
        res.status(400).json({ errorMessage: "Please provide text" });
      } else if (!updatedId) {
        res.status(404).json({
          errorMessage: "The post with the specified ID does not exist"
        });
      } else {
        console.log(updated);
        res.status(200).json(updated);
      }
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The post information could not be modified." });
    });
  Posts.getById(updateId)
    .then(res.json(req.body))
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The post information could not be modified." });
    });
});

// custom middleware

function validatePostId(req, res, next) {
  Posts.getById(req.body.id).then(post => {
    if (!post) {
      res.status(404).json({ message: "invalid post id" });
    } else {
      res.status(201).json(req.body);
    }
  });
  next();
}

module.exports = router;
