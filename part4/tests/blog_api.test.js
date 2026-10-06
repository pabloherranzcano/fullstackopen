const { test, before, after, beforeEach, describe } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const config = require('../utils/config');
const assert = require('assert');
const api = supertest(app);
const Blog = require('../models/blog');
const helper = require('./test_helper');
const bcrypt = require('bcrypt');
const User = require('../models/user');

before(async () => {
  await mongoose.connect(config.MONGODB_URI);
});

beforeEach(async () => {
  await Blog.deleteMany({});
  await Promise.all(helper.initialBlogs.map((blog) => new Blog(blog).save()));
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
  let token;

  beforeEach(async () => {
    const password = 'test-password';
    const passwordHash = await bcrypt.hash(password, 10);
    await User.deleteMany({});
    await new User({ username: 'test-user', passwordHash }).save();

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'test-user', password });

    token = loginResponse.body.token;
  });

  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'How to use async/await',
      author: 'John Doe',
      url: 'https://example.com/async-await',
      likes: 5,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
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

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201);

    const blogsAtEnd = await helper.blogsInDb();
    const addedBlog = blogsAtEnd.find((b) => b.title === newBlog.title);
    assert.strictEqual(addedBlog.likes, 0);
  });

  test('if new blog is missing title or url, backend responds with 400 Bad Request', async () => {
    const newBlog = {
      author: 'John Doe',
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400);
  });

  test('a blog cannot be added without a token', async () => {
    const newBlog = {
      title: 'How to use async/await',
      author: 'John Doe',
      url: 'https://example.com/async-await',
      likes: 5,
    };

    await api.post('/api/blogs').send(newBlog).expect(401);
  });

  test('Blog without title is not added', async () => {
    const newBlog = {
      author: 'John Doe',
      url: 'https://example.com/async-await',
      likes: 5,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400);

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
    const password = 'sekret';
    const user = await new User({
      username: 'root',
      passwordHash: await bcrypt.hash(password, 10),
    }).save();

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password });

    const token = loginResponse.body.token;

    const blog = new Blog({
      title: 'Blog del usuario root',
      author: 'Root',
      url: 'https://example.com/root-blog',
      likes: 3,
      user: user._id,
    });
    const savedBlog = await blog.save();

    await api
      .delete(`/api/blogs/${savedBlog.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
  });
});

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test('creation fails when username has fewer than 3 characters', async () => {
    const response = await api
      .post('/api/users')
      .send({ username: 'ab', name: 'Pablo', password: 'secret' })
      .expect(400);

    assert.strictEqual(
      response.body.error,
      'username must be at least 3 characters long',
    );
  });

  test('creation fails when password has fewer than 3 characters', async () => {
    const response = await api
      .post('/api/users')
      .send({ username: 'Pablo', name: 'Pablo Herranz', password: 'ab' })
      .expect(400);

    assert.strictEqual(
      response.body.error,
      'password must be at least 3 characters long',
    );
  });
});

after(async () => {
  await mongoose.connection.close();
});
