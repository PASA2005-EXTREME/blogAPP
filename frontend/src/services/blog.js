import axios from 'axios'

const api = axios.create({
  baseURL: 'https://render-test2-mg8o.onrender.com/api',
})

export const getBlogs = async () => (await api.get('/blogs')).data
export const createBlog = async (data) => (await api.post('/blogs', data)).data
export const deleteBlog = async (id) => await api.delete(`/blogs/${id}`)
