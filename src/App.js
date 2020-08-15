import React from 'react';

import DrawCycle from './utils/draw-cycle';

import './styles/app.scss';

function App() {
  const canvasRef = React.useRef(null);
  const contextRef = React.useRef(null);

  const LINE_WIDTH = 1;
  const DRAW_INTERVAL_TIME = 250; // milliseconds
  const STEP_SIZE = 10;

  // const LINE_COLORS = [
  //   [255, 105, 180], // Hotpink
  //   [127, 255, 0], // Chartreuse
  //   [0, 255, 255], // Cyan
  // ];

  // const LINE_COLORS = [
  //   [0, 0, 0], // Black
  //   [255, 0, 0], // Red
  // ];

  const LINE_COLORS = [[0, 0, 0]]; // Black

  // Initialize the context
  React.useEffect(() => {
    // Set up the Canvas to work with Retina displays
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;

    // Set up the Context
    const context = canvas.getContext('2d');
    context.scale(2, 2);
    context.lineCap = 'round';
    context.lineWidth = LINE_WIDTH;

    contextRef.current = context;
  }, []);

  // Begin drawing when context is available
  React.useEffect(() => {
    const canvas = canvasRef.current;

    const seeds = [
      {
        x: canvas.width * 0.25,
        y: canvas.height * 0.25,
        t: DRAW_INTERVAL_TIME,
      },
      {
        x: canvas.width * 0.33,
        y: canvas.height * 0.25,
        t: DRAW_INTERVAL_TIME * 0.66,
      },
      {
        x: canvas.width * 0.125,
        y: canvas.height * 0.25,
        t: DRAW_INTERVAL_TIME * 0.75,
      },
    ];

    const drawCycles = seeds.map((seed, index) => {
      console.log('New DrawCycle at: ', seed.x, seed.y, seed.t);

      let newCycle = new DrawCycle(
        seed.x,
        seed.y,
        1,
        -1,
        STEP_SIZE,
        seed.t,
        canvas,
        LINE_COLORS
      );

      return setInterval(() => {
        newCycle.drawLine();
      }, DRAW_INTERVAL_TIME);
    });

    return () => drawCycles.forEach((interval) => clearInterval(interval));
  }, [LINE_COLORS, contextRef]);

  // Create the canvas to draw on
  return <canvas ref={canvasRef} />;
}

export default App;
