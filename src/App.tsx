import React from 'react';
import './App.css';
import { NewStopwatch } from './components/NewStopwatch';
import Stopwatch from './components/Stopwatch';

function App() {
  return (
    <>
     <h1>Functional Stopwatch</h1>
     <NewStopwatch initialSeconds={0} />
     <h2>The old Stopwatch</h2>
     <Stopwatch initialSeconds={0}/>
    </>
   
  );
}

export default App;
