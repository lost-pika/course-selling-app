const express = require('express');
const courseRouter = express.Router();
const {previewCourses} = require("../controllers/course.controller");
const {purchaseCourse} = require("../controllers/course.controller");
const {userMiddleware} = require("../middlewares/user.middleware")

// when a user wants to purchase a course
courseRouter.post('/purchase',userMiddleware, purchaseCourse );

courseRouter.get('/preview',userMiddleware, previewCourses);


module.exports = courseRouter;