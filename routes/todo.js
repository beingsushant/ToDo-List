const express = require("express");
const router = express.Router();
const User = require("../model/User");
const Todo = require("../model/TodoList");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const TodoList = require("../model/TodoList");
const logger = require('../middleware/logger');

router.post("/addtask", [body("task", "Task can't be empty").isLength({ min: 1 }),
body("hours", "Hours can't be empty").exists(), body("hours", "Hours can't be greater than 24 or less than 0").isInt({ min: 0, max: 24 }), body("minutes", "Minutes can't be empty").exists(), body("minutes", "Minutes can't be greater than 60 or less than 0").isInt({ min: 0, max: 60 })], fetchuser, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error(errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user1 = await User.findById(req.user.id);
        const date = new Date();
        date.setHours(req.body.hours);
        const taskAdded = await Todo.create({
            user: user1,
            task: req.body.task,
            hours: req.body.hours,
            minutes: req.body.minutes,
            date: date
        });

        logger.info("Task Added Successfully");
        res.json(taskAdded);
    }
    catch (error) {
        logger.error(error);
    }
}
)

router.get("/fetchtask", fetchuser, async (req, res) => {

    try {
        const user1 = await User.findById(req.user.id);
        const data = await Todo.find({ user: user1 });

        logger.info("Task Fetched Successfully");
        res.json(data);
    }
    catch (error) {
        logger.error(error);
    }
}
)


router.put('/updatetask/:id', fetchuser, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error(errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    const { task, hours, minutes } = req.body;
    let task1 = await TodoList.findById(req.params.id);
    if (task1.user.toString() !== req.user.id) {
        res.status(400).send("Please try again with correct credentials");
    }
    else {

        try {

            const newTask = {
            };

            if (task.length > 0) {
                newTask.task = task;
            }
            else {
                res.status(400).json("Task can't be empty");
            }
            if (hours < 24 && hours > 0) {
                newTask.hours = hours;
            }
            else {
                res.status(400).json("Hours can't be greater than 24 or less than 0");
            }
            if (minutes < 60 && minutes > 0) {
                newTask.minutes = minutes;
            }
            else {
                res.status(400).json("Minutes can't be greater than 60 or less than 0");
            }



            let currentTask = await TodoList.findByIdAndUpdate(req.params.id, { $set: newTask }, { new: true });
            logger.info("Task Updated Successfully");
            res.json({ currentTask });
        }
        catch (error) {
            logger.error(error);
            res.status(500).send("Internal Server Error");
        }


    }
})

router.put('/deletetask/:id', fetchuser, async (req, res) => {
    let task1 = await TodoList.findById(req.params.id);
    if (task1.user.toString() !== req.user.id) {
        logger.error(errors.array());
        res.status(400).send("Please try again with correct credentials");
    }
    else {

        try {

            let currentTask = await TodoList.findByIdAndDelete(req.params.id);
            logger.info("Task Deleted Successfully");
            res.json({ currentTask });
        }
        catch (error) {
            logger.error(error);
            res.status(500).send("Internal Server Error");
        }


    }
})


module.exports = router;