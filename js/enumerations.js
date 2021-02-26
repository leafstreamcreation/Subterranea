const MOVEMENT = {
  UP: -1,
  DOWN: 1,
  LEFT: -1,
  RIGHT: 1,
  NONE: 0,
};

const BOUNDS = {
  INSIDE: 0,
  OUTSIDE_UP: 1,
  OUTSIDE_RIGHT: 2,
  OUTSIDE_DOWN: 3,
  OUTSIDE_LEFT: 4,
};

const DIRECTION = {
  NONE: 0,
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4,
};

const TYPE_TAGS = {
  PLAYER: "player",
  BOMB: "bomb",
  OBSTACLE: "obstacle",
};

const ASSET_TAGS = {
  BOARD: "board",
  PLAYER: "player",
  BOMB: "bomb",
  ROCK: "rock",
};

const KEY_TAGS = {
  LEFT: "ArrowLeft",
  A: "a",
  RIGHT: "ArrowRight",
  D: "d",
  UP: "ArrowUp",
  W: "w",
  DOWN: "ArrowDown",
  S: "s",
  SPACE: " ",
};
