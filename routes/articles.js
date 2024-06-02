const express = require("express");
const auth = require("../middleware/auth");

const { getArticles, createArticle, getArticle, deleteArticle, updateArticle, addComment } = require("../controllers/articles");

const router = express.Router();

router.get("/", auth, getArticles);

router.post("/", auth, createArticle);

router.get("/:id", auth, getArticle);

router.delete("/:id", auth, deleteArticle);

router.put("/:id", auth, updateArticle);

router.post("/:id/comments", auth, addComment);

module.exports = router;
