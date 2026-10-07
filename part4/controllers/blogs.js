const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const middleware = require('../utils/middleware');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });

  response.json(blogs);
});

blogRouter.post('/', async (request, response, next) => {
  const body = request.body;
  const token = request.token;

  if (!token) {
    return response.status(401).json({ error: 'token missing' })
  }

  const decodedToken = jwt.verify(token, process.env.SECRET)
  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  const savedBlog = await blog.save();

  if (user) {
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
  }

  response.status(201).json(savedBlog);
});

blogRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id);

  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogRouter.delete('/:id', async (request, response, next) => {
  const blogToDelete = await Blog.findById(request.params.id);

  if (!blogToDelete) {
    return response.status(404).json({ error: 'blog not found' });
  }

  const token = request.token;

  if (!token) {
    return response.status(401).json({ error: 'token missing' });
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.SECRET);
  } catch (error) {
    return response.status(401).json({ error: 'token invalid' });
  }
  if (!decodedToken || !decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const userId = blogToDelete.user.toString();

  if (!userId || userId !== decodedToken.id) {
    return response
      .status(401)
      .json({ error: 'unauthorized, only the creator can delete this blog' });
  }

  await Blog.findByIdAndDelete(request.params.id);

  response.status(204).end();
});

blogRouter.put('/:id', async (request, response, next) => {
  const { likes } = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes },
    {
      returnDocument: 'after',
      runValidators: true,
      context: 'query',
    },
  );

  response.json(updatedBlog);
});

blogRouter.get(
  '/.well-known/appspecific/com.chrome.devtools.json',
  (request, response) => {
    response.status(204).end();
  },
);

module.exports = blogRouter;
