class SubterraneaGame {
  static REFRESH_MILLISECONDS = 16;
  static GRID_SIZE = 15;

  constructor(canvas, context) {
    this.boardWidth = canvas.width;
    this.boardHeight = canvas.height;
    this.context = context;

    this.grid = this.newGrid();
    
    this.player = new Player(
      new Position(0, 0),
      new Size(
        Math.floor(this.boardWidth / SubterraneaGame.GRID_SIZE),
        Math.floor(this.boardHeight / SubterraneaGame.GRID_SIZE)
      ),
      TYPE_TAGS.PLAYER,
      ASSET_TAGS.PLAYER
    );
    this.playerMoveState = {
      vertical: MOVEMENT.NONE,
      horizontal: MOVEMENT.NONE,
    };
    this.actors = [this.player];

    this.obstacles = this.generateObstacles(1);
    this.fillGrid();

    this.assets = {};
    this.loadAssets();

    setInterval(() => this.gameLoop(), SubterraneaGame.REFRESH_MILLISECONDS);
  }

  gameLoop() {
    this.moveActors();
    //draw the board
    this.assets[ASSET_TAGS.BOARD]();
    //draw sinkholes
    //draw terrain
    this.assets[ASSET_TAGS.ROCK](0);
    //draw monsters
    //draw player
    this.assets[ASSET_TAGS.PLAYER]();
  }

  loadAssets() {
    this.assets[ASSET_TAGS.BOARD] = () => {
      this.context.fillStyle = "rgb(255, 255, 0)";
      this.context.fillRect(0, 0, this.boardWidth, this.boardHeight);
    };
    this.assets[ASSET_TAGS.BOARD]();

    this.assets[ASSET_TAGS.PLAYER] = () => {
      this.context.fillStyle = "rgb(0, 255, 0)";
      this.context.fillRect(
        this.player.position.x,
        this.player.position.y,
        this.player.size.width,
        this.player.size.height
      );
    };
    this.assets[ASSET_TAGS.PLAYER]();

    this.assets[ASSET_TAGS.ROCK] = (id) => {
      this.context.fillStyle = "rgb(0, 0, 255)";
      this.context.fillRect(
        this.obstacles[id].position.x,
        this.obstacles[id].position.y,
        this.obstacles[id].size.width,
        this.obstacles[id].size.height
      );
    };
    //TODO: DRAW MULTIPLE OBSTACLES
    this.assets[ASSET_TAGS.ROCK](0);
  }

  moveActors() {

    this.player.move(
      this.playerMoveState.horizontal,
      this.playerMoveState.vertical,
      this.boardWidth
    );
  }

  handleKeyDown(key) {
    switch (key) {
      case KEY_TAGS.S:
      case KEY_TAGS.DOWN:
        this.playerMoveState.vertical = MOVEMENT.DOWN;
        break;
      case KEY_TAGS.W:
      case KEY_TAGS.UP:
        this.playerMoveState.vertical = MOVEMENT.UP;
        break;
      case KEY_TAGS.A:
      case KEY_TAGS.LEFT:
        this.playerMoveState.horizontal = MOVEMENT.LEFT;
        break;
      case KEY_TAGS.D:
      case KEY_TAGS.RIGHT:
        this.playerMoveState.horizontal = MOVEMENT.RIGHT;
        break;
      default:
        break;
    }
  }

  handleKeyUp(key) {
    switch (key) {
      case KEY_TAGS.W:
      case KEY_TAGS.S:
      case KEY_TAGS.DOWN:
      case KEY_TAGS.UP:
        this.playerMoveState.vertical = MOVEMENT.NONE;
        break;
      case KEY_TAGS.A:
      case KEY_TAGS.D:
      case KEY_TAGS.LEFT:
      case KEY_TAGS.RIGHT:
        this.playerMoveState.horizontal = MOVEMENT.NONE;
        break;
      default:
        break;
    }
  }

  newGrid() {
    const grid = [];
    const gridElementScale = Math.floor(this.boardWidth / SubterraneaGame.GRID_SIZE);
    for (let i = 0; i < SubterraneaGame.GRID_SIZE; i++) {
      grid.push([]);
      for (let j = 0; j < SubterraneaGame.GRID_SIZE; j++) {
        grid[i].push(new GridElement(j, i, gridElementScale));
      }
    }
    return grid;
  }

  generateObstacles(number) {
    const obstacles = [];
    for (let i = 0; i < number; i++) {
      obstacles.push(new GameObject(
        TYPE_TAGS.OBSTACLE,
        ASSET_TAGS.ROCK,
      ))
    }
    return obstacles;
  }

  fillGrid() {
    const gridElementScale = Math.floor(this.boardWidth / SubterraneaGame.GRID_SIZE)
    this.grid[0][0].objects.push(this.player);
    this.player.position = new Position(this.grid[0][0].x, this.grid[0][0].y);
    this.player.size = new Size(gridElementScale, gridElementScale);
    this.player.container = this.grid[0][0];

    this.grid[7][7].objects.push(this.obstacles[0]);
    this.obstacles[0].position = new Position(this.grid[7][7].x, this.grid[7][7].y);
    this.obstacles[0].size = new Size(gridElementScale, gridElementScale);
    this.obstacles[0].container = this.grid[7][7];
  }
}
