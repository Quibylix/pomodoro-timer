import { useEffect, useRef, useState } from "react";
import { ACTIVITY_TIMES } from "./activity-times.constant";

export type PomodoroActivity = keyof typeof ACTIVITY_TIMES;
export type PomodoroStatus = "running" | "paused" | "stopped";

const alarmSound = new Audio("/alarm.mp3");

export function usePomodoroTimer() {
  const [leftTime, setLeftTime] = useState(ACTIVITY_TIMES.working);
  const [status, setStatus] = useState<PomodoroStatus>("stopped");
  const [activity, setActivity] = useState<PomodoroActivity>("working");
  const [sessionCount, setSessionCount] = useState(1);

  const timeoutRef = useRef<number | undefined>(undefined);

  function setNewTimeout(
    activity: PomodoroActivity,
    leftTime: number,
    sessionCount: number,
  ) {
    timeoutRef.current = setTimeout(
      getTimeoutCallback(activity, leftTime, sessionCount),
      1000,
    );
  }

  function getTimeoutCallback(
    activity: PomodoroActivity,
    leftTime: number,
    sessionCount: number,
  ) {
    const initialTimestamp = Date.now();

    return () => {
      const elapsed = Date.now() - initialTimestamp;

      let newLeftTime = leftTime - Math.round(elapsed / 1000);

      if (newLeftTime > 0) {
        setLeftTime(newLeftTime);
        setNewTimeout(activity, newLeftTime, sessionCount);
        return;
      }

      alarmSound.play();

      let newSessionCount = sessionCount;
      let newActivity = activity;
      if (activity === "shortBreak" || activity === "longBreak") {
        newActivity = "working";
        newSessionCount++;
      } else if (sessionCount % 3 == 0) {
        newActivity = "longBreak";
      } else {
        newActivity = "shortBreak";
      }

      newLeftTime = ACTIVITY_TIMES[newActivity];
      setActivity(newActivity);
      setLeftTime(newLeftTime);
      setSessionCount(newSessionCount);
      setNewTimeout(newActivity, newLeftTime, newSessionCount);
    };
  }

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  function run() {
    setStatus("running");
    setNewTimeout(activity, leftTime, sessionCount);
  }

  function pause() {
    setStatus("paused");
    clearTimeout(timeoutRef.current);
  }

  function stop() {
    setStatus("stopped");
    setActivity("working");
    setLeftTime(ACTIVITY_TIMES.working);
    setSessionCount(1);
    clearTimeout(timeoutRef.current);
  }

  return { leftTime, activity, status, sessionCount, run, pause, stop };
}
