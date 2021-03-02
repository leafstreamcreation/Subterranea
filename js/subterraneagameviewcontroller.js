class SubterraneaGame {
  static REFRESH_MILLISECONDS = 16;
  static GRID_SIZE = 15;
  static PLAYER_SPEED = 2;
  static BOMB_SPEED = 2;

  constructor(canvas, context) {
    this.boardWidth = canvas.width;
    this.boardHeight = canvas.height;
    this.context = context;

    this.grid = new Grid(this.boardWidth, SubterraneaGame.GRID_SIZE);

    this.player = new Player(this, SubterraneaGame.PLAYER_SPEED);
    this.actors = [this.player];

    this.objects = this.generateRocks(50);
    this.fillGrid();

    this.assets = {};
    this.loadAssets();

    this.bombPower = 1;
    this.bombDamage = 1;
    this.bombFuseTime = 3000;

    this.resources = 0;

    setInterval(() => this.gameLoop(), SubterraneaGame.REFRESH_MILLISECONDS);
  }

  gameLoop() {
    this.moveActors();

    this.draw();
  }

  draw() {
    //draw the board
    this.assets[ASSET_TAGS.BOARD]();
    this.objects.forEach((object) => this.assets[object.asset](object));
    //draw sinkholes
    //draw terrain
    // this.rocks.forEach((rock) => this.assets[rock.asset](rock));
    //draw monsters
    this.actors.forEach((actor) => this.assets[actor.asset](actor));
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

    this.placeHolderAsset(
      ASSET_TAGS.ROCK,
      "rgb(0, 0, 255)",
      this.objects,
      false
    );

    this.placeHolderAsset(
      ASSET_TAGS.BOMB,
      "rgb(255, 0, 0)",
      this.actors,
      false
    );

    this.placeHolderAsset(
      ASSET_TAGS.FIRE,
      "rgb(255, 127, 0)",
      this.objects,
      false
    );

    this.placeHolderAsset(
      ASSET_TAGS.GUNPOWDER,
      "rgb(0, 0, 0)",
      this.objects,
      false
    );

    this.placeHolderAsset(
      ASSET_TAGS.UNOBTAINIUM,
      "rgb(255, 255, 255)",
      this.objects,
      false
    );
  }

  moveActors() {
    this.actors.forEach((actor) => actor.move(this.boardWidth));
  }

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
    this.player.newContainer(this.grid.container[playerGridY][playerGridX]);
    this.player.snapToGrid();

    const objectPlacements = new Shuffler(
      this.getObstaclePlacementsAround(playerGridY, playerGridX, 1)
    );
    this.objects.forEach((object) => {
      const index = objectPlacements.drawNext();
      object.newContainer(this.grid.container[index.y][index.x]);
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
    this.spawnObject(
      Bomb,
      [
        this,
        ASSET_TAGS.BOMB,
        TYPE_TAGS.BOMB,
        0,
        SubterraneaGame.BOMB_SPEED,
        this.bombPower,
        this.bombDamage,
        this.bombFuseTime,
      ],
      [this.player.container]
    );
  }

  spawnObject(constructor, args, containers) {
    containers.forEach((container) => {
      const instance = new constructor(...args);
      instance.newContainer(container);
      if (instance instanceof Actor) {
        instance.snapToGrid();
        instance.id = this.actors.length;
        this.actors.push(instance);
      } else if (instance instanceof GameObject) {
        instance.id = this.objects.length;
        this.objects.push(instance);
      }
      // console.log(
      //   `spawned object: ${instance.asset} ${instance.type} ${instance.id} at: ${instance.container.gridX} ${instance.container.gridY}`
      // );
    });
  }

  destroy(object) {
    object.container.remove(object);
    if (object instanceof Actor) this.remove(object, this.actors);
    else this.remove(object, this.objects);
    this.actors.forEach((actor) => actor.refreshNearbyObjects());
  }

  remove(object, collection) {
    if (collection.includes(object)) {
      for (let id = object.id + 1; id < collection.length; id++) {
        collection[id].id -= 1;
      }
      collection.splice(object.id, 1);
    }
  }

  playerPickedUp(type) {
    console.log(`player picked up: ${type}`);
    switch (type) {
      case TYPE_TAGS.POWERUP:
        this.bombPower += 1;
        this.bombFuseTime -= 500;
        break;
      case TYPE_TAGS.RESOURCE:
        this.resources += 1;
        break;
      default:
        break;
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
