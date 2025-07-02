const { Router } = require("express");
const adminRouter = Router();
const Admin = require("../models/admin.model");
const { signup } = require("../controllers/admin.controllers");
const { signin } = require("../controllers/admin.controllers");
const { createCourse } = require("../controllers/admin.controllers");
const { updateCourse } = require("../controllers/admin.controllers");
const { getCoursesByAdmin } = require("../controllers/admin.controllers");
const { adminMiddleware } = require("../middlewares/admin.middleware");

adminRouter.post("/signup", signup);

adminRouter.post("/signin", signin);

// create a course
adminRouter.post("/course", adminMiddleware, createCourse);

// update the course
adminRouter.put("/course",adminMiddleware, updateCourse);

// get courses (give me all the courses that I have created)
adminRouter.get("/course/bulk",adminMiddleware, getCoursesByAdmin);

module.exports = adminRouter;