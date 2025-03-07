import { useEffect, useState, useRef } from "react";

const formattedSeconds = (sec: number) =>
  Math.floor(sec / 60) + ":" + ("0" + (sec % 60)).slice(-2);

export const NewStopwatch: React.FC<{ initialSeconds: number }> = ({
  initialSeconds,
}) => {
  // State for tracking elapsed time
  const [secondsElapsed, setSecondsElapsed] = useState(initialSeconds);

  // State for storing lap times
  const [laps, setLaps] = useState<number[]>([]);

  // State to track if the stopwatch is running or not
  const [isRunning, setIsRunning] = useState(false);

  // useRef to store the interval ID without causing unnecessary re-renders
  const incrementer = useRef<NodeJS.Timeout | null>(null);

  // useEffect to start and stop the timer when `isRunning` changes
  useEffect(() => {
    // Start a new interval if the stopwatch is running
    if (isRunning) {
      incrementer.current = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      // Clear the interval if the stopwatch is stopped
      if (incrementer.current) {
        clearInterval(incrementer.current);
      }
    }
    // Cleanup function to clear the interval when the component unmounts
    return () => {
      if (incrementer.current) {
        clearInterval(incrementer.current);
      }
    };
  }, [isRunning]); // Runs whenever `isRunning` state changes

  // Start button click handler
  const handleStartClick = () => {
    setIsRunning(true);
  };

  // Stop button click handler
  const handleStopClick = () => {
    setIsRunning(false);
  };

  // Reset button click handler - stops the timer, resets time and laps
  const handleResetClick = () => {
    setIsRunning(false);
    setSecondsElapsed(0);
    setLaps([]);
  };

  // Lap button click handler - saves the current time as a lap
  const handleLapClick = () => {
    setLaps((prevLaps) => [...prevLaps, secondsElapsed]);
  };

  return (
    <div className="stopwatch">
      <h1 className="stopwatch-timer">{formattedSeconds(secondsElapsed)}</h1>
      <div>
        {!isRunning ? (
          <button onClick={handleStartClick} className="start-btn">
            Start
          </button>
        ) : (
          <button onClick={handleStopClick} className="stop-btn">
            Stop
          </button>
        )}
        <button
          onClick={handleResetClick}
          className="reset-btn"
          disabled={secondsElapsed === 0}
        >
          Reset
        </button>
        <button
          onClick={handleLapClick}
          className="lap-btn"
          disabled={!isRunning}
        >
          Lap
        </button>
      </div>
      <div className="stopwatch-laps">
        <ul>
          {laps.map((lap, i) => (
            <li key={i}>
              <strong>Lap {i + 1}:</strong> {formattedSeconds(lap)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
