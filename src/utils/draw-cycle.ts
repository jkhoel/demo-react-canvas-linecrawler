type Point = {
  x: number,
  y: number,
}

export default class DrawCycle {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null;
  startX: number;
  startY: number;
  startDirectionX: number;
  startDirectionY: number;
  step_size: number;
  intervalTime: number;
  colorArray: Array<string>;
  nextPoint: object;
  minOpacity: number;
  maxOpacity: number;
  originX: number;
  originY: number;

  constructor(
    startX: number,
    startY: number,
    startDirectionX: number,
    startDirectionY: number,
    step_size: number,
    intervalTime: number,
    canvasRef: object,
    colorArray: Array<string>
  ) {
    // Arguments
    this.canvas = canvasRef as HTMLCanvasElement;
    this.startX = startX;
    this.startY = startY;
    this.startDirectionX = startDirectionX;
    this.startDirectionY = startDirectionY;
    this.step_size = step_size;
    this.intervalTime = intervalTime;
    this.colorArray = colorArray;

    // Defaults and calculated values
    this.context = this.canvas.getContext('2d');
    this.originX = startX;
    this.originY = startY;
    this.minOpacity = 10;
    this.maxOpacity = 50;
    this.nextPoint = this.getNextPoint(startX, startY, startDirectionX, startDirectionY)

    // this.startCycle = () => null;
    // this.stopCycle = () => null;
  }

  /**
   * Returns a new point (coordinates) offset from the current one
   * @param currentX 
   * @param currentY 
   * @param dirX 
   * @param dirY 
   */
  getNextPoint = (currentX: number, currentY: number, dirX: number, dirY: number): Point => {
    const generateNextPoint = (dir: number, current: number, arr: Array<number>): number => {
      return current + this.randomArrayValue(arr) * dir;
    }
    const stepValuesX = [this.step_size, -this.step_size]
    const stepValuesY = [this.step_size * .8, -this.step_size * .8]
    return { x: generateNextPoint(dirX, currentX, stepValuesX), y: generateNextPoint(dirY, currentY, stepValuesY) }
  };

  /**
   * Checks if a value is outside the min/max values
   * @param value 
   * @param maxValue 
   * @param minValue 
   */
  checkBounds = (value: number, maxValue: number, minValue: number): boolean => {
    if (value >= maxValue || value <= minValue) return true;
    return false;
  };

  /**
   * Returns a random value from the supplied array
   * @param arr 
   */
  randomArrayValue = (arr: Array<any>) => {
    const index = Math.floor(Math.random() * arr.length);
    return arr[index];
  };

  /**
   * Returns a random value between the min and max values
   * @param min 
   * @param max 
   */
  randomMinMaxValue = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  /**
   * Draws a line from the start point to the nextPoint each cycle
   */
  drawLine = () => {
    // Escape if the context is not available
    if (!this.context) return false;

    // Set some values
    let dirX = 1;
    let dirY = -1;
    const rgb = this.randomArrayValue(this.colorArray);
    this.context.strokeStyle = `rgb(${rgb[0]} ${rgb[1]} ${
      rgb[2]
      } / ${this.randomMinMaxValue(
        this.minOpacity,
        this.maxOpacity
      )}%)`;

    const nextPoint = this.getNextPoint(
      this.startX,
      this.startY,
      dirX,
      dirY
    );

    // console.log('DrawCycle X/Y: ', this.startX, this.startY, nextPoint.x, nextPoint.y);
    console.log('<= Number of Lines!');

    // Restart the line at origin if we are outside of the canvas area
    if (
      this.checkBounds(nextPoint.x, this.canvas.width / 2, 0) ||
      this.checkBounds(nextPoint.y, this.canvas.height / 2, -this.canvas.height / 2)
    ) {
      this.startX = this.originX;
      this.startY = this.originY;
    } else {
      // .. and if not, Do some drawing
      this.context.beginPath();
      this.context.moveTo(this.startX, this.startY);
      this.context.lineTo(nextPoint.x, nextPoint.y);
      this.context.stroke();
      this.context.closePath();

      // Update some values
      this.startX = nextPoint.x;
      this.startY = nextPoint.y;
    }
  }
}
