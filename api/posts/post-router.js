const express = require("express");
const Post = require("./post-model");

const router = express.Router();

function checkId(req, res, next) {
  next();
}

function checkPayload(req, res, next) {
  next();
}

router.get("/", async (req, res, next) => {
  try {
    const data = await Post.get();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", checkId, async (req, res, next) => {
  try {
    res.status(200).json(req.post);
  } catch (err) {
    next(err);
  }
});

router.post("/", checkPayload, async (req, res, next) => {
  const body = req.body;
  try {
    const data = await Post.create(body);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", checkId, checkPayload, async (req, res, next) => {
  const { id } = req.params;
  const changes = req.body;
  try {
    const data = await Post.update(id, changes);
    res.status(200).json({ count: data });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", checkId, async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await Post.remove(id);
    res.status(200).json({ count: data });
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, next) => {
  err.statusCode = err.statusCode ? err.statusCode : 500;
  res.status(err.statusCode).json({ message: err.message, stack: err.stack });
});

async function checkId(req, res, next) {
  const { id } = req.params;
  try {
    const post = await Post.getById(id);
    if (post) {
      req.post = post;
      next();
    } else {
      const err = new Error("invalid id");
      err.statusCode = 404;
      next(err);
    }
  } catch (err) {
    err.statusCode = 500;
    err.message = "error retrieving a post";
    next(err);
  }
}

function checkPayload(req, res, next) {
  const body = req.body;
  if (!body.title || !body.contents) {
    const err = new Error('body must included "title" and "contents".');
    err.statusCode = 400;
    next(err);
  } else {
    next();
  }
}

module.exports = router;
