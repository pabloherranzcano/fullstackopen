const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: 'Understanding JavaScript Closures',
    author: 'Maya Chen',
    url: 'https://example.com/javascript-closures',
    likes: 12,
  },
  {
    title: 'A Practical Guide to React Hooks',
    author: 'Oliver Smith',
    url: 'https://example.com/react-hooks',
    likes: 8,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'We will remove this blog soon',
    author: 'Remover',
    url: 'https://example.com/remove-blog',
    likes: 9,
  });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
};
