const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const favorite = blogs.reduce((prev, current) => {
    return prev.likes > current.likes ? prev : current
  })

  return favorite
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const blogCount = {}

  blogs.forEach((blog) => {
    if (blogCount[blog.author]) {
      blogCount[blog.author] += 1
    } else {
      blogCount[blog.author] = 1
    }
  })

  const mostBlogsAuthor = Object.keys(blogCount).reduce((a, b) => {
    return blogCount[a] > blogCount[b] ? a : b
  })

  return { author: mostBlogsAuthor, blogs: blogCount[mostBlogsAuthor] }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const likeCount = {}

  blogs.forEach((blog) => {
    if (likeCount[blog.author]) {
      likeCount[blog.author] += blog.likes
    } else {
      likeCount[blog.author] = blog.likes
    }
  })

  const mostLikesAuthor = Object.keys(likeCount).reduce((a, b) => {
    return likeCount[a] > likeCount[b] ? a : b
  })

  return { author: mostLikesAuthor, likes: likeCount[mostLikesAuthor] }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}