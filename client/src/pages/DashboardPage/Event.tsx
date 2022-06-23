import React from "react";
import cx from "classnames";
import styles from "./DashboardPage.module.scss";

interface IProps {
  event: IEvent;
  clicked: string;
  onClick: (_id: string) => void;
  onDelete: (_id: string) => void;
}

const Event = ({ event, clicked, onClick, onDelete }: IProps) => {
  const eventDate = new Date(event.year, event.month - 1, event.day).toLocaleDateString("en-GB");

  return (
    <div className={styles.eventWrapper}>
      <div
        onClick={onClick.bind(null, event._id)}
        className={cx(styles.event, { [styles["event--clicked"]]: clicked === event._id })}
        style={{
          borderLeftColor: colors[0][0],
          backgroundColor: colors[0][1],
        }}
        key={event._id}
      >
        <p className={styles.description}>
          {event.description}
          <span className={styles.date}>{eventDate}</span>
        </p>
        <p className={styles.daysRemaining}>{event.daysRemaining ? `${event.daysRemaining} days to go` : "Today"}</p>
      </div>

      <button
        onClick={onDelete.bind(null, event._id)}
        className={styles.deleteBtn}
        disabled={clicked !== event._id}
      ></button>
    </div>
  );
};

export default React.memo(Event);

const colors = [
  ["#cecece", "#f7f7f7"],
  ["#ec8b93", "#fedce0"],
  ["#f0cd5c", "#fff7d1"],
  ["#9b97f3", "#ebf0fc"],
  ["#7cbcb5", "#e9faf7"],
];
