// backend/src/controllers/postController.js
const { Post, User } = require('../models');

exports.list = async (req, res, next) => {
  try {
    const { category } = req.query;
    let posts = await Post.find({});
    posts = posts.map(p => (p.toJSON ? p.toJSON() : p));

    if (category && category !== 'Todas') {
      posts = posts.filter(p => p.category === category);
    }

    posts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const userId = req.user?.id || '1';
    const user = await User.findById(userId);

    const post = await Post.create({
      author_id: String(userId),
      author_name: user?.name || 'Estudante MEET-US',
      author_avatar: user?.avatar || 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&h=400&fit=crop&crop=faces',
      author_course: user?.course || 'Engenharia Informática',
      author_institution: user?.institution || 'Universidade Eduardo Mondlane',
      title: req.body.title,
      content: req.body.content,
      category: req.body.category || 'Geral',
      tags: req.body.tags || ['MEETUS']
    });

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

exports.toggleLike = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || '1';
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Publicação não encontrada' });

    const likes = post.likes || [];
    const index = likes.indexOf(String(userId));
    if (index === -1) {
      likes.push(String(userId));
    } else {
      likes.splice(index, 1);
    }

    post.likes = likes;
    post.likes_count = likes.length;
    await post.save();

    res.json({ likes_count: post.likes_count, is_liked: index === -1 });
  } catch (err) {
    next(err);
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || '1';
    const user = await User.findById(userId);
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Publicação não encontrada' });

    const newComment = {
      author_id: String(userId),
      author_name: user?.name || 'Estudante',
      author_avatar: user?.avatar || '',
      text: req.body.text,
      created_at: new Date().toISOString()
    };

    post.comments = post.comments || [];
    post.comments.push(newComment);
    await post.save();

    res.status(201).json(newComment);
  } catch (err) {
    next(err);
  }
};
