const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require("cors");
const connectToDB = require("./db/db")
const userRouter = require('./routes/user.route');
const courseRouter = require('./routes/courses.route');
const adminRouter = require('./routes/admin.route');
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cors());

app.use(cookieParser());

const PORT = process.env.PORT || 8000;

app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/admin", adminRouter);

const main = async () => {
    await connectToDB();
    app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
})
} // this will first connect to db and then start the server (only start when database is up)

main();


// understand git pull: can pull the changes