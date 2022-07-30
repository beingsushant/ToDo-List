const express = require("express");
const router = express.Router();
const User = require("../model/User");
var jwt = require("jsonwebtoken");
const logger = require("./logger");

var JWT_SECRET = "ABSAJDHAIUJ74";

const fetchuser = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        logger.error("Invalid Token");
        res.json({ error: error.array() });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        logger.info("User Fetched Successfully");
        next();
    } catch (error) {
        logger.error(error);
        res.status(401).send({ error });
    }
}

module.exports = fetchuser;