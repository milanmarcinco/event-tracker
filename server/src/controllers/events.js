const Event = require("../models/Event");
const { calculateRemainingDays } = require("../helpers/events");

// TODO:
// - Validate and sanitize request bodies and params

exports.getEvents = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const { limit = 50, skip = 0 } = req.query;
    const currDate = new Date();
    const currDay = currDate.getDate();
    const currMonth = currDate.getMonth() + 1;

    const eventsCursor = await Event.find({
      owner,
      $or: [{ month: currMonth, day: { $gte: currDay } }, { month: { $gt: currMonth } }],
    })
      .sort({ month: "asc", day: "asc" })
      .cursor();

    const events = [];
    let skipCounter = 0;
    let event = await eventsCursor.next();

    while (events.length < limit && event != null) {
      if (skipCounter < skip) {
        skipCounter++;
      } else if (events.length < limit) {
        events.push(event);
      } else {
        break;
      }

      event = await eventsCursor.next();
    }

    if (events.length < limit) {
      const eventsToAddCursor = await Event.find({
        owner,
        $or: [{ month: { $lt: currMonth } }, { month: currMonth, day: { $lt: currDay } }],
      })
        .sort({ month: "asc", day: "asc" })
        .cursor();

      let eventToAdd = await eventsToAddCursor.next();

      while (events.length < limit && eventToAdd != null) {
        if (skipCounter < skip) {
          skipCounter++;
        } else if (events.length < limit) {
          events.push(eventToAdd);
        } else {
          break;
        }

        eventToAdd = await eventsToAddCursor.next();
      }
    }

    res.status(200).json({
      events: events.map((event) => calculateRemainingDays(event)),
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

exports.getEventById = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const eventId = req.params._id;

    const event = await Event.findOne({ owner, _id: eventId });

    res.status(200).json({
      event: calculateRemainingDays(event),
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    const eventData = req.body;

    const newEvent = new Event(eventData);

    newEvent.owner = req.user._id;

    await newEvent.save();

    res.status(200).json({
      event: calculateRemainingDays(newEvent),
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const eventId = req.params._id;
    const eventDetails = req.body.event;

    const event = await Event.findOneAndUpdate(
      { owner, _id: eventId },
      { ...eventDetails },
      { new: "after", useFindAndModify: false }
    );

    res.status(200).json({
      event: calculateRemainingDays(event),
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const eventId = req.params._id;

    await Event.findOneAndDelete({ owner, _id: eventId }, { useFindAndModify: false });

    res.status(200).json({
      error: null,
    });
  } catch (err) {
    next(err);
  }
};
