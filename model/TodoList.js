const mongoose = require("mongoose");
const User = require("./User");
const { Schema } = mongoose;
const TodoList = new Schema({
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usertable'
    },
    task: {
        type: String,
        required: true,
        unique: true
    },
    hours: {
        type: Number,
        required: true
    },
    minutes: {
        type: Number,
        required: true
    },
    date: {
        type: Date
    }
})

module.exports = mongoose.model("todolist", TodoList);