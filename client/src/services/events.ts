import axios from "axios";
import { errorHandler } from "./utils";

export const getEvents = async () => {
  try {
    const res = await axios.get("/events");
    return res.data.events;
  } catch (err) {
    errorHandler(err);
  }
};

export const createEvent = async (formData: any) => {
  try {
    const res = await axios.post("/events", formData);
    return res.data.event;
  } catch (err) {
    errorHandler(err);
  }
};

export const deleteEvent = async (_id: string) => {
  try {
    await axios.delete("/events/" + _id);
    return;
  } catch (err) {
    errorHandler(err);
  }
};
