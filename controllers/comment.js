const Comment = require("../models/Comment");
const Blog = require("../models/Blog");

async function addComment(req, res) {
    try {
        const { blogId, comment } = req.body;

        if (!blogId || !comment) {
            return res
                .status(400)
                .json({ message: "Blog ID and comment required" });
        }

        const newComment = new Comment({
            blog: blogId,
            user: req.user.id,
            comment,
        });

        await newComment.save();

        const populatedComment = await Comment.findById(
            newComment._id
        ).populate("user", "username");

        res.status(201).json(populatedComment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

async function getComments(req, res) {
    try {
        const { blogId } = req.params;

        const comments = await Comment.find({ blog: blogId }).populate(
            "user",
            "username email"
        );

        return res.json(comments);
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "Server error", error: error.message });
    }
}

async function deleteComment(req, res) {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.user.toString() !== req.user.id && !req.user.isAdmin) {
            return res
                .status(403)
                .json({ message: "Not authorized to delete this comment" });
        }

        await comment.deleteOne();
        return res.json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "Server error", error: error.message });
    }
}

module.exports = {
    addComment,
    getComments,
    deleteComment,
};
