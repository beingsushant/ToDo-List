const express = require("express");
const router = express.Router();
const User = require("../model/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const logger = require('../middleware/logger');


const JWT_SECRET = "ABSAJDHAIUJ74";

router.post('/signup', [body('name', 'Name must be at least 4 characters').isLength({ min: 4 }), body('email', 'Enter a valid email').isEmail(), body('password', 'Password must be at least 5 characters').isLength({ min: 5 })], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error(errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: password,
        });

        const data = {
            user: {
                id: user.id
            }
        }

        const token = jwt.sign(data, JWT_SECRET);
        logger.info("User Registered Successfully");
        res.json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }

})

router.post('/login', [body('email', 'Enter a valid email').isEmail(),
body('password', 'Please enter a password').exists()], async (req, res) => {
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
        logger.error(errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            logger.error("Incorrect Credentials");
            return res.status(400).json({error: "Please try again with correct credentials" });
        }

        // const currentPassword = await bcrypt.hash(req.body.password, salt);
        const pass = await bcrypt.compare(req.body.password, user.password);

        if (!pass) {
            logger.error("Incorrect Credentials");
            return res.status(400).json({ error: "Please try again with correct credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        }

        success = true;

        const token = jwt.sign(data, JWT_SECRET);
        logger.info("User Logged In Successfully");
        res.json({ success, token });

    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }

})

router.get('/getuser', fetchuser, async (req, res) => {

    try {
        const userOne = req.user.id;
        let user = await User.findOne({ _id: userOne });
        if (!user) {
            logger.error("Incorrect Credentials");
            return res.status(400).send("Please try again with correct credentials");
        }
        logger.info("GetUser: User Fetched Successfully");
        res.json({ user });

    } catch (error) {
        logger.error(error);
        res.status(500).send("Internal Server Error");
    }

})

router.put('/updateuser', fetchuser, async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userOne = req.user.id;

        const newUser = {
            name: name,
            email: email,
            password: password
        };

        let userUpdate = await User.findByIdAndUpdate(userOne, { $set: newUser }, { new: true });
        logger.info("User Updated Successfully");
        res.json({ userUpdate });
    }
    catch (error) {
        logger.error(error);
        res.status(500).send("Internal Server Error");
    }

})

router.delete('/deleteuser', fetchuser, async (req, res) => {

    try {
        const userOne = req.user.id;
        let user = await User.findByIdAndDelete({ _id: userOne });
        if (!user) {
            logger.error("Incorrect Credentials");
            return res.status(400).send("Please try again with correct credentials");
        }
        logger.info("User Deleted Successfully");
        res.json({ user });

    } catch (error) {
        logger.error(error);
        res.status(500).send("Internal Server Error");
    }

})



module.exports = router;