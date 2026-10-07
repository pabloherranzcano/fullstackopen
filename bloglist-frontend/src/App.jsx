import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Logout from './components/Logout';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [isErrorNotification, setIsErrorNotification] = useState(false);
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogAuthor, setNewBlogAuthor] = useState('');
  const [newBlogUrl, setNewBlogUrl] = useState('');

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('tokenBlogUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('tokenBlogUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch {
      setNotificationMessage('wrong credentials');
      setIsErrorNotification(true);
      setTimeout(() => {
        setNotificationMessage(null);
        setIsErrorNotification(false);
      }, 5000);
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    window.localStorage.removeItem('tokenBlogUser');
    blogService.setToken(null);
    setUser(null);
  };

  const handleNewBlog = async (event) => {
    event.preventDefault();
    console.log(user.token);
    try {
      const blog = await blogService.create({
        title: newBlogTitle,
        author: newBlogAuthor,
        url: newBlogUrl,
      });
      setNotificationMessage(`A new blog '${blog.title}' by ${blog.author} was created successfully`);
      setIsErrorNotification(false);
      setBlogs(blogs.concat(blog));
      setNewBlogTitle('');
      setNewBlogAuthor('');
      setNewBlogUrl('');
    } catch {
      setNotificationMessage('error creating blog');
      setIsErrorNotification(true);
      setTimeout(() => {
        setNotificationMessage(null);
        setIsErrorNotification(false);
      }, 5000);
    }
  };

  return (
    <div>
      <h1>Blogs</h1>
      <Notification
        message={notificationMessage}
        isErrorNotification={isErrorNotification}
      />
      {user && (
        <h4>
          {user.name} logged in <Logout handleLogout={handleLogout} />
        </h4>
      )}
      {!user && (
        <LoginForm
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          onSubmit={handleLogin}
        />
      )}

      {user && (
        <div>
          <BlogForm
            title={newBlogTitle}
            setTitle={setNewBlogTitle}
            author={newBlogAuthor}
            setAuthor={setNewBlogAuthor}
            url={newBlogUrl}
            setUrl={setNewBlogUrl}
            onSubmit={handleNewBlog}
          />
          <h2>Blogs</h2>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
