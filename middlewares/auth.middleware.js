/**
 * Authentication Middleware
 */

// Dependencies
const jwt = require('jsonwebtoken');
const { APPLICATION_SECRET } = require('../config');

/**
 *  @description Authentication middleware function, checks if user has authToken, verifies it and then proceeds
 * @example 
 * const auth = require('./auth.middleware');
 * Router.post('/api/post/create', auth, createPost); // Only Authenticated users will be able to create posts
 * 
 */
const auth = (req, res, next) => {
    const { authorization: authToken } = req.headers;
    try {
        // Check if Auth Token is there
        if (!authToken) throw new Error('No Auth Token!');

        // Verify Auth Token and User Object
        const decoded = jwt.verify(authToken, APPLICATION_SECRET);
        if (!decoded.user) throw new Error('User object missing!');

        // All good then proceed to next handler
        req.user = decoded.user;
        return next();
    } catch (error) {
        console.log(error);
        res.clearCookie('authToken');
        return res.status(401).json({
            message: 'Access Denied',
            success: false,
            data: {}
        })
    }
};

// Exporting Middleware
module.exports = auth;