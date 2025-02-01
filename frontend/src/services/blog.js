import axios from 'axios'

const response = await axios.post('https://render-blog-s9eo.vercel.app/api/blogs', {
  ...data,
  createdAt: new Date().toISOString()
});


export const getBlogs = async () => (await api.get('/blogs')).data
export const createBlog = async (data) => (await api.post('/blogs', data)).data
export const deleteBlog = async (id) => await api.delete(`/blogs/${id}`)
