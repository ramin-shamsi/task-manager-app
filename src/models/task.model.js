const mongoose = require("mongoose");

const ObjectID = mongoose.Schema.Types.ObjectId;

const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      trim: true,
      required: true,
      minlength: 5,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: ObjectID,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
