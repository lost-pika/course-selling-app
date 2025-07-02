const bcrypt = require("bcrypt");
const Admin = require("../models/admin.model");
const Course = require("../models/course.model");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { email, firstname, lastname, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      email,
      firstname,
      lastname,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// signin logic
const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ error: "Admin does not exist" });
    }

    // checking if the password is correct
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        firstname: admin.firstname,
        lastname: admin.lastname,
      },
      process.env.JWT_ADMIN_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged in successfully", token: token });
  } catch (error) {
    console.error("login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createCourse = async (req, res) => {
  const adminId = req.admin.id;

  try {
    const { title, description, price, imageUrl } = req.body;

    const course = await Course.create({
      title,
      description,
      imageUrl,
      price,
      creatorId: adminId,
    });

    res.json({
      message: "Course created",
      courseId: course._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateCourse = async (req, res) => {
  const adminId = req.admin.id;

  try {
    const courseId = req.params.id;
    console.log(courseId);
    const { title, description, price, imageUrl } = req.body;

    // Find course first to verify creator
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Only allow the course's creator to update it
    if (course.creatorId.toString() !== adminId) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this course" });
    }

    // Update fields
    course.title = title || course.title;
    course.description = description || course.description;
    course.price = price || course.price;
    course.imageUrl = imageUrl || course.imageUrl;

    // await Course.findByIdAndUpdate(
    //   courseId,
    //   {
    //     ...(title && { title }),
    //     ...(description && { description }),
    //     ...(price && { price }),
    //     ...(imageUrl && { imageUrl }),
    //   },
    //   { new: true } // returns updated document
    // );

    await course.save();

    res.json({ message: "Course updated", course });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getCoursesByAdmin = async (req, res) => {
  const adminId = req.admin.id; // extracted from JWT by adminMiddleware

  try {
    const courses = await Course.find({ creatorId: adminId });

    res.json({
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  signup,
  signin,
  createCourse,
  updateCourse,
  getCoursesByAdmin,
};
