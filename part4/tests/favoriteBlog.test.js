const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('favorite blog', () => {
  const blogs = [
    {
      title: 'Blog 1',
      author: 'Author 1',
      likes: 5
    },
    {
      title: 'Blog 2',
      author: 'Author 2',
      likes: 10
    },
    {
      title: 'Blog 3',
      author: 'Author 3',
      likes: 3
    }
  ]

  test('returns the blog with the most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, blogs[1])
  })

  test('returns null for an empty list', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })
})