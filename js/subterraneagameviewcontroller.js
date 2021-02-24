class SubterraneaGame {
  static REFRESH_MILLISECONDS = 16;
  static GRID_SIZE = 15;
  static PLAYER_SPEED = 5;

  constructor(canvas, context) {
    this.boardWidth = canvas.width;
    this.boardHeight = canvas.height;
    this.context = context;

    this.grid = new Grid(this.boardWidth, SubterraneaGame.GRID_SIZE);

    this.player = new Player(SubterraneaGame.PLAYER_SPEED);
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
    //for each actor:
    //
    //if there is
    this.player.move(this.boardWidth);
  }

  handleKeyDown(key) {
    switch (key) {
      case KEY_TAGS.S:
      case KEY_TAGS.DOWN:
        this.player.moveState.vertical = MOVEMENT.DOWN;
        break;
      case KEY_TAGS.W:
      case KEY_TAGS.UP:
        this.player.moveState.vertical = MOVEMENT.UP;
        break;
      case KEY_TAGS.A:
      case KEY_TAGS.LEFT:
        this.player.moveState.horizontal = MOVEMENT.LEFT;
        break;
      case KEY_TAGS.D:
      case KEY_TAGS.RIGHT:
        this.player.moveState.horizontal = MOVEMENT.RIGHT;
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
        this.player.moveState.vertical = MOVEMENT.NONE;
        break;
      case KEY_TAGS.A:
      case KEY_TAGS.D:
      case KEY_TAGS.LEFT:
      case KEY_TAGS.RIGHT:
        this.player.moveState.horizontal = MOVEMENT.NONE;
        break;
      default:
        break;
    }
  }

  generateObstacles(number) {
    const obstacles = [];
    for (let i = 0; i < number; i++) {
      obstacles.push(new GameObject(TYPE_TAGS.OBSTACLE, ASSET_TAGS.ROCK));
    }
    return obstacles;
  }

  fillGrid() {
    this.grid.container[0][0].objects.push(this.player);
    this.player.newContainer(this.grid.container[0][0]);
    this.player.snapToGrid();

    this.grid.container[7][7].objects.push(this.obstacles[0]);
    this.obstacles[0].newContainer(this.grid.container[7][7]);
  }
}
