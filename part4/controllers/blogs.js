const BlogRouter = require('express').Router();
const Blog = require('../models/blog');

BlogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});

  response.json(blogs);
});

BlogRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body);
  const savedBlog = await blog.save();

  response.status(201).json(savedBlog);
});

BlogRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id);

  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

BlogRouter.delete('/:id', async (request, response, next) => {
  await Blog.findByIdAndDelete(request.params.id);

  response.status(204).end();
});

BlogRouter.put('/:id', async (request, response, next) => {
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

BlogRouter.get(
  '/.well-known/appspecific/com.chrome.devtools.json',
  (request, response) => {
    response.status(204).end();
  },
);

module.exports = BlogRouter;
