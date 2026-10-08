import { useState } from 'react'

const Blog = ({ blog, onUpdate, onDelete, user }) => {
  const blogStyle = {
    padding: '4px',
    border: '1px solid black',
    marginBottom: '5px',
    maxWidth: '600px',
  }
  const [showDetails, setShowDetails] = useState(false)
  const [liked, setLiked] = useState(false)
  const isOwner =
    user &&
    blog.user &&
    (String(blog.user.id) === String(user.id) ||
      String(blog.user._id) === String(user.id) ||
      blog.user.username === user.username)

  const blogDetails = () => (
    <div>
      <p>{blog.url}</p>
      <p>{blog.likes} likes</p>{' '}
      <button
        onClick={() => {
          if (!liked) {
            onUpdate({ ...blog, likes: blog.likes + 1 })
            setLiked(true)
          }
        }}
      >
        like
      </button>
      {blog.user?.name && <p>blog created by {blog.user?.name}</p>}
      {isOwner && <button onClick={() => onDelete(blog)}>Delete</button>}
    </div>
  )

  return (
    <div style={blogStyle}>
      {blog.title} by {blog.author}
      <button onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? 'hide' : 'show'}
      </button>
      {showDetails && blogDetails()}
    </div>
  )
}

export default Blog
