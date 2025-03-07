// Please detail what is wrong with the below code, and why. Also where applicable, mention what
// you would do differently.
// ---
// import * as React from "react";
// import * as ReactDOM from "react-dom";
// import { createRoot } from "react-dom/client";
import { Component, ClassAttributes } from "react";
const formattedSeconds = (sec: number) =>
  Math.floor(sec / 60) + ":" + ("0" + (sec % 60)).slice(-2);

interface StopwatchProps extends ClassAttributes<Stopwatch> {
  initialSeconds: number;
}
//Using any for state is bad practice 
interface StopwatchState {
  secondsElapsed: number;
  lastClearedIncrementer: NodeJS.Timeout | null;
  laps: number[];
}

class Stopwatch extends Component<StopwatchProps, StopwatchState> {
  incrementer: NodeJS.Timeout | null;
  // laps: any[]
  constructor(props: StopwatchProps) {
    super(props);
    this.state = {
      secondsElapsed: props.initialSeconds,
      lastClearedIncrementer: null,
      //No need for this.laps anymore, stored in state
      laps: [],
    };

    this.incrementer = null;

    // Bind event handlers
    this.handleStartClick = this.handleStartClick.bind(this);
    this.handleStopClick = this.handleStopClick.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.handleLabClick = this.handleLabClick.bind(this);
  }
  handleStartClick() {
    //Directly accessing this.state.secondsElapsed in setState can lead to stale state updates due to React's asynchronous state updates.
    // this.incrementer = setInterval(() =>
    //     this.setState({
    //     secondsElapsed: this.state.secondsElapsed + 1,
    //     }), 1000);
    if (!this.incrementer) {
      this.incrementer = setInterval(
        () =>
          this.setState((prevState) => ({
            secondsElapsed: prevState.secondsElapsed + 1,
          })),
        1000
      );
    }
  }
  handleStopClick() {
    if (this.incrementer) {
      // because the this.incerement giving error
      clearInterval(this.incrementer);
      //Using prevState in here is unnecessary because the update does not depend on the previous state.
      this.setState({
        lastClearedIncrementer: this.incrementer,
      });
      this.incrementer = null;
    }
  }

  handleResetClick() {
    if (this.incrementer) {
      // needed to add to prevent calling clearInterval on null
      clearInterval(this.incrementer);
    }

    //Comma (,) is used instead of a semicolon (;), making this a syntax error.
    // this.laps = [],
    // this.laps = [];
    //     this.setState({
    //         secondsElapsed: 0,
    //     });
   // Using functional setState() for consistency.
    this.setState(() => ({
        secondsElapsed: 0,
        laps: [],
        lastClearedIncrementer: null,
      }));
    this.incrementer = null;
  }
  handleLabClick() {
    // this.laps = this.laps.concat([this.state.secondsElapsed]);
    // this.forceUpdate();
    //Fixes potential stale state issue
    this.setState((prevState) => ({
      laps: [...prevState.laps, prevState.secondsElapsed],
    }));
  }
  handleDeleteClick(index: number) {
    //Doesn't Re-render
    //return () => this.laps.splice(index, 1);
    // return () => {
    //     this.setState(() => {
    //         this.laps = [...this.laps.slice(0, index), ...this.laps.slice(index + 1)];
    //         return {};
    //     });
    // };
    //Fixes potential stale state issue
    return () => {
        this.setState((prevState) => ({
          laps: prevState.laps.filter((_, i) => i !== index),
        }));
      };
  }
  render() {
    const { secondsElapsed, laps } = this.state;
    return (
      <div className="stopwatch">
        <h1 className="stopwatch-timer">{formattedSeconds(secondsElapsed)}</h1>
        {!this.incrementer ? (
          <button
            type="button"
            className="start-btn"
            onClick={this.handleStartClick}
          >
            start
          </button>
        ) : (
          <button
            type="button"
            className="stop-btn"
            onClick={this.handleStopClick}
          >
            stop
          </button>
        )}
        {secondsElapsed !== 0 && this.incrementer ? (
          <button type="button" onClick={this.handleLabClick}>
            lap
          </button>
        ) : null}
        {secondsElapsed !== 0 && !this.incrementer ? (
          <button type="button" onClick={this.handleResetClick}>
            reset
          </button>
        ) : null}
        <div className="stopwatch-laps">
          {/* {moved laps to state} */}
          {laps.map((lap: number, i: number) => (
              <Lap
                index={i + 1}
                lap={lap}
                onDelete={this.handleDeleteClick(i)}
              />
            ))}
        </div>
      </div>
    );
  }
}
//The return type of onDelete should be void, not {}
const Lap = (props: { index: number; lap: number; onDelete: () => void }) => (
  <div key={props.index} className="stopwatch-lap">
    <strong>{props.index}</strong>/ {formattedSeconds(props.lap)}{" "}
    <button onClick={props.onDelete}> X </button>
  </div>
);
/*
bellow code give us error : The error "Property 'render' does not exist on type 'typeof import("react-dom")'" occurs because React 18 removed ReactDOM.render. 
Instead, we should use the new React 18 root API with createRoot.
ReactDOM.render(
<Stopwatch initialSeconds={0} />,
document.getElementById("content"),
);
*/

// React 18 render method
// const root = createRoot(document.getElementById("content")!);
// root.render(<Stopwatch initialSeconds={0} />);

// To export and test it on App we can comment out above code and only export it
export default Stopwatch;
