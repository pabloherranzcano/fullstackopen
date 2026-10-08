import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Logout from './components/Logout'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({
    message: null,
    isError: false,
  })
  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('tokenBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  const notify = (message, isError = false) => {
    setNotification({ message, isError })
    setTimeout(() => setNotification({ message: null, isError: false }), 5000)
  }

  const handleLogin = async ({ username, password }) => {
    console.log(username)
    console.log(password)
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('tokenBlogUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      notify(`hello, ${user.name}!`)
    } catch {
      notify('wrong credentials', true)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('tokenBlogUser')
    blogService.setToken(null)
    setUser(null)
  }

  const createBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()

    try {
      const blog = await blogService.create(blogObject)
      setBlogs(blogs.concat(blog))
      notify(
        `A new blog '${blog.title}' by ${blog.author} was created successfully`,
      )
    } catch {
      notify('error creating blog', true)
    }
  }

  const updateBlogLikes = async (blogObject) => {
    try {
      const updatedBlog = await blogService.update(blogObject.id, blogObject)
      setBlogs(
        blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog)),
      )
    } catch {
      notify('error updating blog', true)
    }
  }

  const deleteBlog = async (blogObject) => {
    try {
      window.confirm(
        `Delete blog '${blogObject.title}' by ${blogObject.author}?`,
      ) && (await blogService.remove(blogObject.id))
      setBlogs(blogs.filter((blog) => blog.id !== blogObject.id))
      notify(
        `Blog '${blogObject.title}' by ${blogObject.author} was deleted successfully`,
      )
    } catch {
      notify('error deleting blog', true)
    }
  }
  const loginForm = () => (
    <Togglable buttonLabel="login">
      <LoginForm onSubmit={handleLogin} />
    </Togglable>
  )

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm onSubmit={createBlog} />
    </Togglable>
  )

  return (
    <div>
      <h1>Blogs</h1>
      <Notification
        message={notification?.message}
        isErrorNotification={notification?.isError}
      />
      {user && (
        <h4>
          {user.name} logged in <Logout handleLogout={handleLogout} />
        </h4>
      )}

      {!user && loginForm()}

      {user && (
        <>
          {blogForm()}
          <h2>Blogs</h2>
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              onUpdate={updateBlogLikes}
              onDelete={deleteBlog}
              user={user}
            />
          ))}
        </>
      )}
    </div>
  )
}

export default App
