const express = require("express");
const router = express.Router();

const { getEvents, getEventById, createEvent, updateEvent, deleteEvent } = require("../controllers/events");

router.get("/", getEvents);
router.get("/:_id", getEventById);
router.post("/", createEvent);
router.put("/:_id", updateEvent);
router.delete("/:_id", deleteEvent);

module.exports = router;
