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
    this.bombs = [];
    this.actors = [this.player];

    this.obstacles = this.generateObstacles(50);
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
    this.obstacles.forEach(obstacle => this.assets[ASSET_TAGS.ROCK](obstacle));
    //draw monsters
    this.bombs.forEach(bomb => this.assets[ASSET_TAGS.BOMB](bomb));
    //draw player
    this.assets[ASSET_TAGS.PLAYER]();
  }

  loadAssets() {
    this.assets[ASSET_TAGS.BOARD] = () => {
      this.context.fillStyle = "rgb(255, 255, 0)";
      this.context.fillRect(0, 0, this.boardWidth, this.boardHeight);
    };
    //this.assets[ASSET_TAGS.BOARD]();

    this.assets[ASSET_TAGS.PLAYER] = () => {
      this.context.fillStyle = "rgb(0, 255, 0)";
      this.context.fillRect(
        this.player.position.x,
        this.player.position.y,
        this.player.size.width,
        this.player.size.height
      );
    };
    //this.assets[ASSET_TAGS.PLAYER]();

    this.assets[ASSET_TAGS.ROCK] = (rock) => {
      this.context.fillStyle = "rgb(0, 0, 255)";
      this.context.fillRect(
        this.obstacles[rock.id].position.x,
        this.obstacles[rock.id].position.y,
        this.obstacles[rock.id].size.width,
        this.obstacles[rock.id].size.height
      );
    };
    //this.assets[ASSET_TAGS.ROCK](0);

    this.assets[ASSET_TAGS.BOMB] = (bomb) => {
      this.context.fillStyle = "rgb(255, 0, 0)";
      this.context.fillRect(
        this.bombs[bomb.id].position.x,
        this.bombs[bomb.id].position.y,
        this.bombs[bomb.id].size.width,
        this.bombs[bomb.id].size.height
      );
    };
  }

  moveActors() {
    this.actors.forEach(actor => actor.move(this.boardWidth));
  }

  handleKeyDown(key) {
    //dconsole.log(key);
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

      case KEY_TAGS.SPACE:
        this.newBomb();
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
    for (let id = 0; id < number; id++) {
      obstacles.push(new GameObject(TYPE_TAGS.OBSTACLE, ASSET_TAGS.ROCK, id));
    }
    return obstacles;
  }

  fillGrid() {
    const playerGridX = Math.floor(SubterraneaGame.GRID_SIZE * Math.random());
    const playerGridY = Math.floor(SubterraneaGame.GRID_SIZE * Math.random());
    this.grid.container[playerGridY][playerGridX].objects.push(this.player);
    this.player.newContainer(this.grid.container[playerGridY][playerGridX]);
    this.player.snapToGrid();

    const obstaclePlacements = new Shuffler(this.getObstaclePlacementsAround(playerGridY, playerGridX, 1));
    this.obstacles.forEach(obstacle => {
      const index = obstaclePlacements.drawNext();
      this.grid.container[index.y][index.x].objects.push(obstacle);
      obstacle.newContainer(this.grid.container[index.y][index.x]);
    });
  }

  getObstaclePlacementsAround(avoidY, avoidX, distance) {
    const placements = [];
    for (let y = 0; y < SubterraneaGame.GRID_SIZE; y++) {
      for (let x = 0; x < SubterraneaGame.GRID_SIZE; x++) {

        if (Math.abs(avoidX - x) > distance || Math.abs(avoidY - y) > distance) {
            placements.push({y: y, x: x});
        }

      }
    }
    return placements
  }

  newBomb() {
    const bomb = new Actor(ASSET_TAGS.BOMB, TYPE_TAGS.BOMB, this.bombs.length, 5);
    bomb.newContainer(this.player.container);
    bomb.snapToGrid();
    this.grid.container[bomb.container.gridY][bomb.container.gridX].objects.push(bomb);
    this.bombs.push(bomb);
    this.actors.push(bomb);
  }  
}
