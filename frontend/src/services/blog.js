import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

export const getBlogs = async () => (await api.get("/api/blogs")).data;
export const createBlog = async (data) =>
  (await api.post("/api/blogs", data)).data;
export const updateBlog = async (id, data) =>
  (await api.put(`/api/blogs/${id}`, data)).data;
export const deleteBlog = async (id) => api.delete(`/api/blogs/${id}`);
