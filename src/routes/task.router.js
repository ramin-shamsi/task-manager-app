const express = require("express");
const router = new express.Router();
const auth = require("../middlewares/auth");

const Task = require("../models/task.model");

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({ ...req.body, owner: req.user._id });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/tasks", auth, async (req, res) => {
  const options = {};
  const sort = {};
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;
  options.owner = req.user._id;

  if (req.query.completed) {
    options.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }
  try {
    const tasks = await Task.find(options).skip(skip).limit(limit).sort(sort);
    res.status(200).send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const id = req.params.id;
  try {
    const task = await Task.findOne({ _id: id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const availabeUpdates = ["description", "completed"];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) =>
    availabeUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send("Invalid updates!");
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();

    res.send(task);
  } catch (error) {
    res.status(400).send();
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  const id = req.params.id;
  try {
    const task = await Task.findOneAndDelete({ _id: id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
