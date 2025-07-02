const express = require('express');
const courseRouter = express.Router();

// see all the offered courses
courseRouter.get('/', (req, res) => {
    res.json({
        message: "signup endpoint"
    })
});

// when a user wants to purchase a course
courseRouter.post('/purchase', (req, res) => {
    res.json({
        message: "purchase endpoint"
    })
});

courseRouter.get('/preview', (req, res) => {
    res.json({
        message: "course preview endpoint"
    })
});


module.exports = courseRouter;