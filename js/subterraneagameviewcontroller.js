class SubterraneaGame {
  static REFRESH_MILLISECONDS = 16;
  static GRID_SIZE = 15;
  static PLAYER_SPEED = 2;

  constructor(canvas, context) {
    this.boardWidth = canvas.width;
    this.boardHeight = canvas.height;
    this.context = context;

    this.grid = new Grid(this.boardWidth, SubterraneaGame.GRID_SIZE);

    this.player = new Player(this, SubterraneaGame.PLAYER_SPEED);
    this.bombs = [];
    this.actors = [this.player];

    this.rocks = this.generateRocks(50);
    this.fillGrid();

    this.assets = {};
    this.loadAssets();

    setInterval(() => this.gameLoop(), SubterraneaGame.REFRESH_MILLISECONDS);
  }

  gameLoop() {
    this.moveActors();

    this.draw();
  }

  draw() {
    //draw the board
    this.assets[ASSET_TAGS.BOARD]();
    //draw sinkholes
    //draw terrain
    // this.context.fillStyle = "rgb(0, 0, 255)";
    this.rocks.forEach((rock) => this.assets[ASSET_TAGS.ROCK](rock));
    //draw monsters
    this.bombs.forEach((bomb) => this.assets[ASSET_TAGS.BOMB](bomb));
    //draw player
    this.assets[ASSET_TAGS.PLAYER]();
  }

  loadAssets() {
    this.assets[ASSET_TAGS.BOARD] = () => {
      this.context.fillStyle = "rgb(255, 255, 0)";
      this.context.fillRect(0, 0, this.boardWidth, this.boardHeight);
    };
    //this.assets[ASSET_TAGS.BOARD]();

    this.placeHolderAsset(
      ASSET_TAGS.PLAYER,
      "rgb(0, 255, 0)",
      this.player,
      true
    );

    this.placeHolderAsset(ASSET_TAGS.ROCK, "rgb(0, 0, 255)", this.rocks, false);

    this.placeHolderAsset(ASSET_TAGS.BOMB, "rgb(255, 0 ,0)", this.bombs, false);
  }

  moveActors() {
    this.actors.forEach((actor) => actor.move(this.boardWidth));
  }

  cleanBoard() {}

  handleKeyDown(key) {
    //console.log(key);
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

  generateRocks(number) {
    const rocks = [];
    for (let id = 0; id < number; id++) {
      rocks.push(new Rock(this, TYPE_TAGS.ROCK, ASSET_TAGS.ROCK, id));
    }
    return rocks;
  }

  fillGrid() {
    const playerGridX = Math.floor(SubterraneaGame.GRID_SIZE * Math.random());
    const playerGridY = Math.floor(SubterraneaGame.GRID_SIZE * Math.random());
    this.grid.container[playerGridY][playerGridX].objects.push(this.player);
    this.player.newContainer(this.grid.container[playerGridY][playerGridX]);
    this.player.snapToGrid();

    const rockPlacements = new Shuffler(
      this.getObstaclePlacementsAround(playerGridY, playerGridX, 1)
    );
    this.rocks.forEach((rock) => {
      const index = rockPlacements.drawNext();
      this.grid.container[index.y][index.x].objects.push(rock);
      rock.newContainer(this.grid.container[index.y][index.x]);
    });
  }

  getObstaclePlacementsAround(avoidY, avoidX, distance) {
    const placements = [];
    for (let y = 0; y < SubterraneaGame.GRID_SIZE; y++) {
      for (let x = 0; x < SubterraneaGame.GRID_SIZE; x++) {
        if (
          Math.abs(avoidX - x) > distance ||
          Math.abs(avoidY - y) > distance
        ) {
          placements.push({ y: y, x: x });
        }
      }
    }
    return placements;
  }

  newBomb() {
    const bomb = new Bomb(
      this,
      ASSET_TAGS.BOMB,
      TYPE_TAGS.BOMB,
      this.bombs.length,
      5,
      2
    );
    bomb.newContainer(this.player.container);
    bomb.snapToGrid();
    this.grid.container[bomb.container.gridY][
      bomb.container.gridX
    ].objects.push(bomb);
    this.bombs.push(bomb);
    this.actors.push(bomb);
  }

  destroy(object) {
    switch (object.type) {
      case TYPE_TAGS.ROCK:
        object.container.remove(object);
        this.remove(object, this.rocks);
        break;
      case TYPE_TAGS.BOMB:
        object.container.remove(object);
        this.remove(object, this.bombs, true);
        break;
      default:
        break;
    }
    this.actors.forEach((actor) => actor.refreshNearbyObjects());
  }

  remove(object, collection, isActor) {
    if (collection.includes(object)) {
      for (let id = object.id + 1; id < collection.length; id++) {
        collection[id].id -= 1;
      }
      collection.splice(object.id, 1);
      if (isActor) this.actors.splice(object.id + 1, 1);
    }
  }

  placeHolderAsset(tag, color, group, isSingleton) {
    if (isSingleton) {
      this.assets[tag] = () => {
        this.context.fillStyle = color;
        this.context.fillRect(
          group.position.x,
          group.position.y,
          group.size.width,
          group.size.height
        );
        // console.log(`drew a ${tag}!`);
      };
    } else {
      this.assets[tag] = (object) => {
        this.context.fillStyle = color;
        this.context.fillRect(
          group[object.id].position.x,
          group[object.id].position.y,
          group[object.id].size.width,
          group[object.id].size.height
        );
        // console.log(`drew a ${tag}!`);
      };
    }
  }
}
