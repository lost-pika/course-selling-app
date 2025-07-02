const express = require('express'); // getting express object
const userRouter = express.Router();  // express object ha a key called Router
const {signup} = require("../controllers/user.controllers")
const {signin} = require("../controllers/user.controllers")

userRouter.post('/signup', signup);

userRouter.post('/signin', signin);

// user see all of their purchases
userRouter.get('/purchases', (req, res) => {
    res.json({
        message: "purchases endpoint"
    })
});

module.exports = userRouter;