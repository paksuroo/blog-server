const express = require("express");
const {
    addComment,
    getComments,
    deleteComment,
} = require("../controllers/comment");
const { auth } = require("../auth");

const router = express.Router();

router.post("/addComment", auth, addComment);

router.get("/getComments/:blogId", getComments);

router.delete("/deleteComment/:id", auth, deleteComment);

module.exports = router;
