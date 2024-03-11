const router = require('express').Router();
const { User, Post, Comment } = require('../models');

const attributes = ['id', 'title', 'content', 'created_at'];
const include = [
  { model: Comment, attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'], include: { model: User, attributes: ['username'] } },
  { model: User, attributes: ['username'] }
];

router.get('/', async (req, res) => {
  try {
    const dbPostData = await Post.findAll({ attributes, include });
    const posts = dbPostData.map(post => post.get({ plain: true }));
    res.render('homepage', { posts, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/post/:id', async (req, res) => {
  try {
    const dbPostData = await Post.findOne({ where: { id: req.params.id }, attributes, include });
    if (!dbPostData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }
    const post = dbPostData.get({ plain: true });
    res.render('single-post', { post, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => req.session.loggedIn ? res.redirect('/') : res.render('login'));
router.get('/signup', (req, res) => req.session.loggedIn ? res.redirect('/') : res.render('signup'));

router.get('*', (req, res) => res.status(404).send("Can't go there!"));

module.exports = router;
