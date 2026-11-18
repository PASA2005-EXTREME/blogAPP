import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Textarea } from './components/ui/textarea'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Trash2 } from 'lucide-react'
import RichTextEditor from './blog/RichTextEditor'
import RainEffect from '@/components/ui/RainEffect'
import { createBlog, deleteBlog, getBlogs, updateBlog } from './services/blog'

import './App.css'

const BackgroundPattern = () => (
  <div className="fixed inset-0 z-0" style={{ 
    backgroundImage: 'radial-gradient(circle at 1px 1px, #4338ca 1px, transparent 0)',
    backgroundSize: '40px 40px'
  }} />
)

export default function BlogPage() {
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogs = await getBlogs()
        setBlogs(blogs)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching blogs:', error)
      }
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    if (editingBlog && !isSidebarOpen) {
      setIsSidebarOpen(true);
    }
  }, [editingBlog]);

  // Warn on window close with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (editingBlog) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [editingBlog]);

  console.log('Editing blog ID:', editingBlog?._id);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      if (editingBlog) {
        // Update existing blog
        const updatedBlog = await updateBlog(editingBlog._id, data)
        setBlogs(blogs.map(blog => 
          blog._id === editingBlog._id ? updatedBlog : blog
        ));
        setEditingBlog(null);
      } else {
        // Create new blog
        const newBlog = await createBlog({
          ...data,
          createdAt: new Date().toISOString()
        });
        setBlogs([newBlog, ...blogs]);
      }
      reset();
      setIsSidebarOpen(false); // Close sidebar on mobile after submission
    } catch (error) {

      console.error('Error saving blog:', {message: error.response?.data?.message || error.message,
        status: error.response?.status,
        data: error.response?.data});
        alert(error.response?.data?.message || 'Failed to save blog');
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setValue('title', blog.title);
    setValue('author', blog.author);
    setValue('content', blog.content);
    setIsSidebarOpen(true); // Ensure sidebar is open for editing
  };

  const handleDelete = async (id) => {
    try {
      await deleteBlog(id)
      setBlogs(blogs.filter(blog => blog._id !== id))
    } catch (error) {
      console.error('Error deleting blog:', error)
    }
  }

  return (
    <div className="relative flex h-screen bg-slate-900">
      <BackgroundPattern />
      
      {/* Sidebar Toggle Button for Mobile */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-30 p-2 bg-slate-800 rounded-lg md:hidden"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      {/* Sidebar with Create/Edit Blog Form */}
      <div
        className={`fixed md:relative w-full md:w-[420px] lg:w-[480px] h-full bg-slate-800 shadow-2xl p-6 overflow-y-auto z-20 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {editingBlog ? 'Edit Post' : 'Create New Post'}
            </h1>
            {editingBlog && (
              <Button
                type="button"
                onClick={() => {
                  setEditingBlog(null);
                  reset();
                }}
                variant="ghost"
                className="text-red-500 hover:bg-red-500/10"
              >
                Cancel Edit
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Title</Label>
            <Input
              id="title"
              {...register('title', { required: true })}
              className="bg-slate-900 border-slate-700 text-white placeholder-slate-400 focus-visible:ring-2 focus-visible:ring-indigo-500"
              placeholder="Enter post title..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author" className="text-white">Author</Label>
            <Input
              id="author"
              {...register('author', { required: true })}
              className="bg-slate-900 border-slate-700 text-white placeholder-slate-400 focus-visible:ring-2 focus-visible:ring-indigo-500"
              placeholder="Your name..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-white">Content</Label>
            <div className="rounded-lg border border-slate-700 bg-slate-900">
              <RichTextEditor
                value={watch('content')}
                onChange={(value) => setValue('content', value)}
                className="min-h-[200px]"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-indigo-500/50 transition duration-200"
          >
            {isSubmitting ? 'Saving...' : (editingBlog ? 'Update Post' : 'Publish Post')}
          </Button>
        </form>
      </div>

      {/* Main Content Area */}
      <div className="relative flex-1 min-w-0 p-4 md:p-6 lg:p-8 overflow-y-auto bg-slate-900/95 z-10">
        <RainEffect />
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm pb-4 md:pb-6 mb-4 md:mb-6 z-20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">Recent Posts</h2>
              <div className="h-1 w-24 md:w-32 bg-indigo-500 rounded"></div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500 rounded-full animate-ping"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
            {blogs.map(blog => (
              <Card 
                key={blog._id} 
                className="bg-slate-800 border-slate-700 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300"
              >
                <CardHeader className="border-b border-slate-700 p-4">
                  <CardTitle className="text-lg md:text-xl font-bold text-white line-clamp-2">
                    {blog.title}
                  </CardTitle>
                  <div className="flex items-center mt-2 text-xs md:text-sm text-slate-400">
                    <div className="h-2 w-2 rounded-full bg-indigo-500 mr-2"></div>
                    <span className="font-medium text-indigo-400">{blog.author}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4">
                  <div className="blog-content text-slate-300 leading-relaxed text-sm md:text-base">
                    <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-end gap-2 border-t border-slate-700 p-4">
                  <Button
                    variant="secondary"
                    onClick={() => handleEdit(blog)}
                    className="bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-colors duration-200 text-sm md:text-base"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(blog._id)}
                    className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200 text-sm md:text-base"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
