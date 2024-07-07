const express = require('express');
const auth = require('../middleware/auth');
const {
  register,
  login,
  getSavedArticles,
  saveArticle,
  unSaveArticle,
  updateUser,
  getUser,
  changePassword,
} = require('../controllers/users');

const router = express.Router();

router.post('/signup', register);
router.post('/signin', login);

router.get('/:id', auth, getUser);
router.put('/:id/update', auth, updateUser);
router.put('/:id/changePassword', auth, changePassword);
router.post('/:id/saveArticle', auth, saveArticle);
router.put('/:id/unSaveArticle', auth, unSaveArticle);
router.get('/:id/savedArticles', auth, getSavedArticles);

module.exports = router;
