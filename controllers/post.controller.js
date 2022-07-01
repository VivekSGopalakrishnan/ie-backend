/**
 * Post Controllers
 */

// Dependencies
const { default: mongoose } = require('mongoose');
const Post = require('../models/Post');
const { ApiError } = require('../utils/custom.util');

// Post Controller Container
const postController = {};

/**
 * @description Create a new post and reference the user creating it
 * @api {POST} /api/post/create
 * @access User
 * @example 
 * req.body = {
 *  title: 'Hello, World!',
 * }
 */
postController.createPost = async (req, res, next) => {
    // Collecting Required Information from Request Body and Middleware
    const { title } = req.body;
    const user = req.user;
    try {
        // Check if Required Fields are present
        if (!title) throw new ApiError({ message: 'Required fields are missing!', statusCode: 400 });

        // Create new post
        let newPost = await Post.create({ title, createdBy: user._id });

        // Return new post data
        newPost = newPost.toObject();
        return res.status(201).json({
            message: 'Post created successfully!',
            data: { post: newPost },
            success: true,
        })
    } catch (error) {
        next(error);
    }
};

/**
 * @description Fetch all posts' along with the user information
 * @api {GET} /api/post/
 * @access Public
 */
postController.fetchAllPosts = async (req, res, next) => {
    try {
        // Fetch all posts as normal objects instead of documents
        const posts = await Post.find().populate("createdBy", "fullName username").lean();

        // Return all posts as an array
        return res.status(200).json({
            message: 'Posts fetched successfully!',
            data: { posts },
            success: true,
        })
    } catch (error) {
        next(error);
    }
};

/**
 * @description Update a post with its postId
 * @api {PUT} /api/post/update
 * @access User
 * @example 
 * req.body = {
 *  title: 'Hello, there! "General Kenobi!"',
 *  postId: 'asdf3qr13ifef-ifjrfu3eifj'
 * }
 */
postController.updatePost = async (req, res, next) => {
    // Collecting Required Information from Request Body and Middleware
    const { title, postId } = req.body;
    const user = req.user;
    try {
        // Check if Required Fields are present
        if (!title || !postId || !mongoose.isValidObjectId(postId)) throw new ApiError({ message: 'Required fields are missing', statusCode: 400 });

        // Find Post
        let post = await Post.findOne({ _id: postId, createdBy: user._id });
        if (!post) throw new ApiError({ message: `Post with id: ${postId} does not exist!`, statusCode: 404 });

        // If post exists then update details
        post.title = title;
        await post.save();

        // Return with updated data
        post = post.toObject();
        return res.status(200).json({
            message: 'Post updated successfully!',
            data: { post },
            success: true,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @description Delete a post with its postId
 * @api {POST} /api/post/delete
 * @access User
 * @example 
 * req.body = {
 *  postId: 'asdf3qr13ifef-ifjrfu3eifj',
 * }
 */
postController.deletePost = async (req, res, next) => {
    // Collecting Required Information from Request Body and Middleware
    const { postId } = req.body;
    const user = req.user;
    try {
        // Check if Required Fields are present
        if (!postId || !mongoose.isValidObjectId(postId)) throw new ApiError({ message: 'Required fields are missing', statusCode: 400 });

        // Find Post
        let post = await Post.findOne({ _id: postId, createdBy: user._id });
        if (!post) throw new ApiError({ message: `Post with id: ${postId} does not exist!`, statusCode: 404 });

        // Delete Post
        await post.delete();

        // Return with updated data
        post = post.toObject();
        return res.status(200).json({
            message: 'Post deleted successfully!',
            data: {},
            success: true,
        });
    } catch (error) {
        next(error);
    }
};

// Exporting Controller
module.exports = postController;