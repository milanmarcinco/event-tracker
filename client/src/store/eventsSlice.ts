import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// import { RootState, AppDispatch } from "./index";
import {
  getEvents as getEventsService,
  createEvent as createEventService,
  deleteEvent as deleteEventService,
} from "../services/events";

interface IEventsSlice {
  events: IEvent[];

  getEventsLoading: boolean;
  getEventsError: string | null;

  createEventLoading: boolean;
  createEventError: string | null;

  deleteEventLoading: boolean;
  deleteEventError: string | null;
}

export const getEvents = createAsyncThunk("events/getEvents", async (_, thunkAPI) => {
  try {
    const events = await getEventsService();
    return events;
  } catch (err) {
    return thunkAPI.rejectWithValue(err);
  }
});

export const createEvent = createAsyncThunk("events/createEvent", async (formData: any, thunkAPI) => {
  try {
    const event = await createEventService(formData);
    thunkAPI.dispatch(getEvents());
    return event;
  } catch (err) {
    return thunkAPI.rejectWithValue(err);
  }
});

export const deleteEvent = createAsyncThunk("events/deleteEvent", async (_id: string, thunkAPI) => {
  try {
    await deleteEventService(_id);
    thunkAPI.dispatch(getEvents());
    return;
  } catch (err) {
    return thunkAPI.rejectWithValue(err);
  }
});

const initState: IEventsSlice = {
  events: [],

  getEventsLoading: false,
  getEventsError: null,

  createEventLoading: false,
  createEventError: null,

  deleteEventLoading: false,
  deleteEventError: null,
};

const eventsSlice = createSlice({
  name: "auth",
  initialState: initState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getEvents.fulfilled, (state, action) => {
      state.events = action.payload;
      state.getEventsLoading = false;
      state.getEventsError = null;
    });

    builder.addCase(getEvents.pending, (state, action) => {
      state.getEventsLoading = true;
      state.getEventsError = null;
    });

    builder.addCase(getEvents.rejected, (state, action) => {
      state.getEventsLoading = false;
      state.getEventsError = action.payload as string;
    });

    // =====

    builder.addCase(createEvent.fulfilled, (state, action) => {
      state.createEventLoading = false;
      state.createEventError = null;
    });

    builder.addCase(createEvent.pending, (state, action) => {
      state.createEventLoading = true;
      state.createEventError = null;
    });

    builder.addCase(createEvent.rejected, (state, action) => {
      state.createEventLoading = false;
      state.createEventError = action.payload as string;
    });

    // =====

    builder.addCase(deleteEvent.fulfilled, (state, action) => {
      state.deleteEventLoading = false;
      state.deleteEventError = null;
    });

    builder.addCase(deleteEvent.pending, (state, action) => {
      state.deleteEventLoading = true;
      state.deleteEventError = null;
    });

    builder.addCase(deleteEvent.rejected, (state, action) => {
      state.deleteEventLoading = false;
      state.deleteEventError = action.payload as string;
    });
  },
});

export default eventsSlice.reducer;
