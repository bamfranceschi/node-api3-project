const express = require("express");
const Users = require("./userDb.js");
const Posts = require("../posts/postDb.js");

const router = express.Router();

//POST for new user -- tested and working

router.post("/", validateUser, (req, res) => {
  Users.insert(req.body)
    .then(user => {
      // if (!req.body.name) {
      //   res.status(400).json({ message: "you need a name, yo!" });
      // } else {
      res.status(201).json(user);
      // }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "Error adding the user" });
    });
});

//POST for a new post

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  const postInfo = { ...req.body, user_id: req.params.id };

  Posts.insert(postInfo)
    .then(post => {
      res.status(210).json(post);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "Error getting the posts for the user" });
    });
});

//GET for all users -- tested and working

router.get("/", (req, res) => {
  Users.get()
    .then(allUsers => {
      res.status(200).json(allUsers);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "Error adding the user" });
    });
});

//GET for one user -- tested and working

router.get("/:id", validateUserId, (req, res) => {
  Users.getById(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "user not found" });
      }
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the user"
      });
    });
});

//GET one user's posts

router.get("/:id/posts", validateUserId, (req, res) => {
  const id = req.params.id;

  Users.getUserPosts(id)
    .then(posts => {
      if (!id) {
        res.status(400).json({ message: "posts not found" });
      } else {
        res.status(200).json(posts);
      }
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the posts"
      });
    });
});

//DELETE user -- tested and working

router.delete("/:id", validateUserId, (req, res) => {
  Users.getById(req.params.id).then(deleted => {
    if (deleted.length === 0) {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist." });
    } else {
      Users.remove(req.params.id).then(res.status(200).json(deleted));
    }
  });
});

//UDPATE a user -- tested and working

router.put("/:id", validateUserId, (req, res) => {
  const updateId = req.params.id;

  Users.update(updateId, req.body)
    .then(updated => {
      if (!req.body.name) {
        res
          .status(400)
          .json({ errorMessage: "Please provide name for the user." });
      } else if (!updateId) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      } else {
        console.log(updated);
        res.status(200).json(updated);
      }
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The user information could not be modified." });
    });

  Users.getById(updateId)
    .then(res.json(req.body))
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The user information could not be modified." });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  Users.getById(req.params.id).then(user => {
    if (!user) {
      res.status(404).json({ message: "invalid user id" });
    } else {
      req.user = user;
    }
  });
  next();
}

function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "missing user data" });
  } else if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    res.status(201).json(req.body);
  }
  next();
}

function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "missing post data" });
  } else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field" });
  } else {
    res.status(201).json(req.body);
  }
  next();
}

module.exports = router;
