const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

const attributes = ['id', 'title', 'content', 'created_at'];
const include = [
  { model: Comment, attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'], include: { model: User, attributes: ['username'] } },
  { model: User, attributes: ['username'] }
];

router.get('/', withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.findAll({ where: { user_id: req.session.user_id }, attributes, include });
    const posts = dbPostData.map(post => post.get({ plain: true }));
    res.render('dashboard', { posts, loggedIn: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/edit/:id', withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.findOne({ where: { id: req.params.id }, attributes, include });
    if (!dbPostData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }
    const post = dbPostData.get({ plain: true });
    res.render('edit-post', { post, loggedIn: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/new', (req, res) => res.render('add-post', { loggedIn: true }));

module.exports = router;
