const { test, before, after, beforeEach, describe } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const config = require('../utils/config');
const assert = require('assert');
const api = supertest(app);
const Blog = require('../models/blog');
const helper = require('./test_helper');

before(async () => {
  await mongoose.connect(config.MONGODB_URI);
});

beforeEach(async () => {
  await Blog.deleteMany({});
  await Promise.all(
    helper.initialBlogs.map((blog) => new Blog(blog).save()),
  );
});

describe('when fetching blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test('blogs use id instead of _id', async () => {
    const response = await api.get('/api/blogs');
    const blog = response.body[0];

    assert.strictEqual(typeof blog.id, 'string');
    assert.strictEqual('_id' in blog, false);
  });

  test('there are two blogs', async () => {
    const response = await api.get('/api/blogs');

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs');

    const contents = response.body.map((r) => r.title);

    assert(contents.includes('Understanding JavaScript Closures'));
  });
});

describe('when adding blogs', () => {
  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'How to use async/await',
      author: 'John Doe',
      url: 'https://example.com/async-await',
      likes: 5,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

    const contents = blogsAtEnd.map((b) => b.title);
    assert(contents.includes('How to use async/await'));
  });

  test('if likes property is missing, it will default to 0', async () => {
    const newBlog = {
      title: 'How to use async/await',
      author: 'John Doe',
      url: 'https://example.com/async-await',
    };

    await api.post('/api/blogs').send(newBlog).expect(201);

    const blogsAtEnd = await helper.blogsInDb();
    const addedBlog = blogsAtEnd.find((b) => b.title === newBlog.title);
    assert.strictEqual(addedBlog.likes, 0);
  });

  test('if new blog is missing title or url, backend responds with 400 Bad Request', async () => {
    const newBlog = {
      author: 'John Doe',
    };

    await api.post('/api/blogs').send(newBlog).expect(400);
  });

  test('Blog without title is not added', async () => {
    const newBlog = {
      author: 'John Doe',
      url: 'https://example.com/async-await',
      likes: 5,
    };

    await api.post('/api/blogs').send(newBlog).expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });
});

describe('when managing existing blogs', () => {
  test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb();

    const blogToView = blogsAtStart[0];

    const resultblog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.deepStrictEqual(resultblog.body, blogToView);
  });

  test('a blog likes can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: blogToUpdate.likes + 1 })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(updatedBlog.body.likes, blogToUpdate.likes + 1);
    assert.strictEqual(updatedBlog.body.title, blogToUpdate.title);
  });

  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    const titles = blogsAtEnd.map((r) => r.title);
    assert(!titles.includes(blogToDelete.title));

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
  });
});

after(async () => {
  await mongoose.connection.close();
});
