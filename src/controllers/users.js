const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = user.getSignedJwtToken();
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      message: 'success',
      token,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide an email and password',
      });
    }
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid credential',
      });
    }
    const isMatch = await user.matchPassword(password);
    console.log(isMatch);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credential',
      });
    }

    const token = user.getSignedJwtToken();

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      message: 'success',
      token,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Success',
      user,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name;
    user.email = email;
    await user.save();

    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
exports.changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(id).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(oldPassword);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid old password' });
    }

    // Update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
exports.saveArticle = async (req, res) => {
  try {
    const { articleId } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.savedArticles.push(articleId);
    await user.save();

    res.status(200).json({
      message: 'Article saved successfully',
      savedArticles: user.savedArticles,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.unSaveArticle = async (req, res) => {
  try {
    const { articleId } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove articleId from savedArticles array
    user.savedArticles = user.savedArticles.filter(
      (savedArticle) => savedArticle.toString() !== articleId
    );
    await user.save();

    res.status(200).json({
      message: 'Article unsaved successfully',
      savedArticles: user.savedArticles,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getSavedArticles = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('savedArticles');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Success',
      savedArticles: user.savedArticles,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
