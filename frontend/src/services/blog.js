import axios from 'axios'

const api = axios.create({
  baseURL: 'https://render-blog-s9eo.vercel.app/api/blogs'
})

export const getBlogs = async () => (await api.get('/blogs')).data
export const createBlog = async (data) => (await api.post('/blogs', data)).data
export const deleteBlog = async (id) => await api.delete(`/blogs/${id}`)
