export const directions = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT"
};

// used to keep the user from doing an in-place 180 (and losing immediately)
export const directionOpposites = {
  [directions.UP]: directions.DOWN,
  [directions.DOWN]: directions.UP,
  [directions.LEFT]: directions.RIGHT,
  [directions.RIGHT]: directions.LEFT
};
