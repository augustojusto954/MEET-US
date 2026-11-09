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
    let user = req.user;
    const authorId = req.user?.id || req.user?._id || req.body.authorId || req.body.userId;

    if (!user && authorId) {
      user = await User.findById(authorId);
      if (!user) {
        user = await User.findOne({ _id: authorId });
      }
    }

    const authorName = user?.name || req.body.authorName || 'Estudante MEET-US';
    let authorAvatar = user?.avatar || req.body.authorAvatar || '';
    if (!authorAvatar) {
      const bgColors = ['059669', '2563EB', '7C3AED', 'D97706', 'DC2626', '0D9488', '4F46E5', '0284C7', 'E11D48', '0891B2'];
      const charSum = authorName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const bg = bgColors[Math.abs(charSum) % bgColors.length];
      authorAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=${bg}&color=ffffff&size=256&bold=true`;
    }
    const authorCourse = user?.course || req.body.authorCourse || 'Ensino Superior';
    const authorInstitution = user?.institution || req.body.authorInstitution || 'Universidade Eduardo Mondlane';

    const post = await Post.create({
      author_id: String(user?._id || user?.id || authorId || 'anon'),
      author_name: authorName,
      author_avatar: authorAvatar,
      author_course: authorCourse,
      author_institution: authorInstitution,
      title: req.body.title,
      content: req.body.content,
      category: req.body.category || 'Geral',
      tags: req.body.tags || ['MEETUS']
    });

    res.status(201).json(post.toJSON ? post.toJSON() : post);
  } catch (err) {
    next(err);
  }
};

exports.toggleLike = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.user?._id || req.body.userId || 'anon';
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
    let user = req.user;
    const userId = req.user?.id || req.user?._id || req.body.authorId || req.body.userId;
    if (!user && userId) {
      user = await User.findById(userId);
    }
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Publicação não encontrada' });

    const authorName = user?.name || req.body.authorName || 'Estudante';
    let authorAvatar = user?.avatar || req.body.authorAvatar || '';
    if (!authorAvatar) {
      const bgColors = ['059669', '2563EB', '7C3AED', 'D97706', 'DC2626', '0D9488', '4F46E5', '0284C7', 'E11D48', '0891B2'];
      const charSum = authorName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const bg = bgColors[Math.abs(charSum) % bgColors.length];
      authorAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=${bg}&color=ffffff&size=256&bold=true`;
    }

    const newComment = {
      author_id: String(user?._id || user?.id || userId || 'anon'),
      author_name: authorName,
      author_avatar: authorAvatar,
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
