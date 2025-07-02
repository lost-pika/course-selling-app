const Course = require("../models/course.model");
const Purchase = require("../models/purchase.model");

const purchaseCourse = async (req, res) => {
  const userId = req.user.id;
  const courseId = req.body.courseId;

  try {
    if(!courseId){
        return res.status(400).json({ error: "Course ID is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const alreadyPurchased = await Purchase.findOne({ userId, courseId });
    if (alreadyPurchased) {
      return res.status(409).json({ error: "Course already purchased" });
    }

    await Purchase.create({
      userId,
      courseId,
    });

    res.status(200).json({
      message: "You have successfully purchased the course",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const previewCourses = async (req, res) => {
  try {
    const courses = await Course.find({});

    return res.status(200).json({
        count: courses.length,
      courses,
    });
  } catch (error) {
    console.log("Courses not found");
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

module.exports = {
  previewCourses,
  purchaseCourse,
};
