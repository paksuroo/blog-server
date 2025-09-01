const express = require("express");
const {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
} = require("../controllers/blog");
const { auth } = require("../auth");

const router = express.Router();

router.get("/getBlogs", getBlogs);
router.get("/getBlog/:id", getBlogById);

router.post("/createBlog", auth, createBlog);
router.put("/updateBlog/:id", auth, updateBlog);

router.delete("/deleteBlog/:id", auth, deleteBlog);

module.exports = router;
