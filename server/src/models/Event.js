const { Schema, model } = require("mongoose");
const validator = require("validator");

const EventSchema = new Schema(
  {
    description: {
      type: String,
      required: [true, "Event description is required"],
      maxLength: [50, "Event description is too long"],
      trim: true,
    },

    day: {
      type: Number,
      min: [1, "Invalid date"],
      max: [31, "Invalid date"],
      required: [true, "Event date is required"],
    },

    month: {
      type: Number,
      min: [1, "Invalid date"],
      max: [12, "Invalid date"],
      required: [true, "Event date is required"],
    },

    colorTag: {
      type: String,
      default: "#eee",
      validate: {
        validator: (v) => validator.isHexColor(v),
        message: "Invalid color tag",
      },
      required: false,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

EventSchema.methods.toJSON = function () {
  const event = this;
  const eventObj = event.toObject();

  delete eventObj.__v;
  delete eventObj.updatedAt;

  return eventObj;
};

const EventModel = model("Event", EventSchema);

module.exports = EventModel;
