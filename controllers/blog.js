const Blog = require("../models/Blog");

async function createBlog(req, res) {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res
                .status(400)
                .json({ message: "Title and content are required" });
        }

        const newBlog = new Blog({
            title,
            content,
            author: req.user.id,
        });

        await newBlog.save();
        return res.status(201).json(newBlog);
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server error", error: error.message });
    }
}

async function getBlogs(req, res) {
    try {
        const blogs = await Blog.find()
            .populate("author", "username email")
            .populate("commentsCount");

        return res.json(blogs);
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server error", error: error.message });
    }
}

async function getBlogById(req, res) {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate("author", "username email")
            .populate("commentsCount");

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        return res.json(blog);
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server error", error: error.message });
    }
}

async function updateBlog(req, res) {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        if (blog.author.toString() !== req.user.id) {
            return res
                .status(403)
                .json({ message: "Not authorized to update this blog" });
        }

        blog.title = req.body.title || blog.title;
        blog.content = req.body.content || blog.content;

        await blog.save();
        return res.json(blog);
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server error", error: error.message });
    }
}

async function deleteBlog(req, res) {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        if (blog.author.toString() !== req.user.id && !req.user.isAdmin) {
            return res
                .status(403)
                .json({ message: "Not authorized to delete this blog" });
        }

        await blog.deleteOne();
        return res.json({ message: "Blog deleted successfully" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server error", error: error.message });
    }
}

module.exports = {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
};
