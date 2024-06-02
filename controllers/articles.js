const Article = require("../models/Article");
const Comment = require("../models/Comment");

exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ date: -1 });
    res.status(200).json({
      message: "success",
      data: articles,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.createArticle = async (req, res) => {
  try {
    const article = await Article.create(req.body);
    res.status(200).json({
      message: "success",
      data: article,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getArticle = async (req, res) => {
  try {
    const articleId = req.params.id;

    const article = await Article.findById(articleId).populate({
      path: "comments",
      populate: {
        path: "userId",
        select: "name email",
      },
    });

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    res.status(200).json({
      message: "success",
      data: article,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    await Comment.deleteMany({ articleId: req.params.id });

    await Article.findByIdAndRemove(req.params.id);

    res.status(200).json({
      message: "Article and its comments deleted successfully",
      data: {},
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.updateArticle = async (req, res) => {
  try {
    let article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Not found " });
    }

    article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "success",
      data: article,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.addComment = async (req, res) => {
  try {
    const articleId = req.params.id;
    const { userId, valueComment } = req.body;

    const article = await Article.findById(articleId);

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    const newComment = await Comment.create({
      valueComment,
      userId,
      articleId,
    });

    article.comments.push(newComment._id);
    await article.save();

    res.status(200).json({
      message: "Comment added successfully",
      data: newComment,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
