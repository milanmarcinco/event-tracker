import { useState, useEffect } from "react";

import useDispatch from "../../hooks/useDispatch";
import useSelector from "../../hooks/useSelector";
import { eventsSliceSelector } from "../../store/selectors";
import { getEvents, deleteEvent } from "../../store/eventsSlice";

import Button from "../../components/reusable/Button";
import AddEventForm from "./AddEventForm";
import Event from "./Event";

import { ReactComponent as RefreshIcon } from "../../assets/refresh-icon.svg";
import { ReactComponent as AddIcon } from "../../assets/add-icon.svg";

import styles from "./DashboardPage.module.scss";

const DashboardPage = () => {
  const { events } = useSelector(eventsSliceSelector);

  const [addEventMode, setAddEventMode] = useState(false);
  const [clickedEvent, setClickedEvent] = useState<string>("");

  const dispatch = useDispatch();

  useEffect(() => {
    if (events.length) return;
    dispatch(getEvents());
  }, [events.length, dispatch]);

  const handleRefresh = () => {
    dispatch(getEvents());
  };

  const handleClick = (_id: string) => {
    if (_id === clickedEvent) return setClickedEvent("");
    setClickedEvent(_id);
  };

  const handleDelete = async (_id: string) => {
    await dispatch(deleteEvent(_id));
    setClickedEvent("");
  };

  return (
    <div className={styles.wrapper}>
      {!addEventMode && (
        <div className={styles.controls}>
          <Button title="Refresh" variant="secondary" icon={<RefreshIcon />} onClick={handleRefresh} />
          <Button title="Add" variant="primary" icon={<AddIcon />} onClick={() => setAddEventMode(true)} />
        </div>
      )}

      {addEventMode && <AddEventForm handleCancel={() => setAddEventMode(false)} />}

      <div className={styles.events}>
        {events.length > 0 ? (
          events.map((event) => (
            <Event event={event} clicked={clickedEvent} onClick={handleClick} onDelete={handleDelete} key={event._id} />
          ))
        ) : (
          <p className={styles.noEventsMessage}>No events, start by clicking the add event button above ^^</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
