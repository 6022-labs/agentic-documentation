import React, { type ReactNode } from "react";
import styles from "./styles.module.css";

type TaskTimeProps = {
  minutes: number;
};

// TaskTime shows how long a tutorial takes to do, not to read.
export default function TaskTime({ minutes }: TaskTimeProps): ReactNode {
  return (
    <p className={styles.taskTime}>
      <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
      {minutes} min to complete
    </p>
  );
}
