import styles from "./pomodoro-timer.module.css";

import { CircularProgressBar } from "../circular-progress-bar/circular-progress-bar.component";
import { ACTIVITY_TIMES } from "./activity-times.constant";
import { usePomodoroTimer } from "./use-pomodoro-timer.hook";
import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconPlayerStopFilled,
} from "@tabler/icons-react";
import { formatTime } from "./format-time.util";

export type PomodoroActivity = keyof typeof ACTIVITY_TIMES;
export type PomodoroStatus = "running" | "paused" | "stopped";

export function PomodoroTimer() {
  const { leftTime, status, activity, sessionCount, run, pause, stop } =
    usePomodoroTimer();

  const activityColor = {
    working: "#22c166",
    shortBreak: "#3174fe",
    longBreak: "#ff656a",
  }[activity];

  const activityText = {
    working: "Stay focus for 25 minutes",
    shortBreak: "Take a short break for 5 minutes",
    longBreak: "Take a long break for 15 minutes",
  }[activity];

  return (
    <div className={styles.container}>
      <div className={styles.progressBar}>
        <CircularProgressBar
          progress={leftTime / ACTIVITY_TIMES[activity]}
          color={activityColor}
        >
          <div className={styles.info}>
            <p className={styles.leftTime}>{formatTime(leftTime)}</p>
            <p className={styles.sessionCount}>Session count: {sessionCount}</p>
          </div>
        </CircularProgressBar>
      </div>
      <p className={styles.activity}>{activityText}</p>
      <div className={styles.buttons}>
        {status !== "running" && (
          <button className={styles.startButton} onClick={run} type="button">
            <IconPlayerPlayFilled />
          </button>
        )}
        {status === "running" && (
          <button className={styles.pauseButton} onClick={pause} type="button">
            <IconPlayerPauseFilled />
          </button>
        )}
        <button
          className={styles.stopButton}
          onClick={stop}
          type="button"
          disabled={status === "stopped"}
        >
          <IconPlayerStopFilled width="1em" />
        </button>
      </div>
    </div>
  );
}
