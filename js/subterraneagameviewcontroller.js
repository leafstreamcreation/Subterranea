class SubterraneaGame {
  static REFRESH_MILLISECONDS = 16;
  static GRID_SIZE = 15;
  static PLAYER_SPEED = 2;
  static BOMB_SPEED = 2;
  static ROCK_AMOUNT = 100;
  static RESOURCE_VICTORY = 10;
  static RESOURCE_DOWNTICK_INTERVAL = 15000;

  constructor(
    canvas,
    context,
    onGameEnd,
    onBombPowerUpdated,
    onResourceChanged,
    onPlayerHealthChanged
  ) {
    this.boardWidth = canvas.width;
    this.boardHeight = canvas.height;
    this.context = context;

    this.gameEndUpdate = onGameEnd;
    this.bombPowerUpdate = onBombPowerUpdated;
    this.resourceUpdate = onResourceChanged;
    this.playerHealthUpdate = onPlayerHealthChanged;

    this.grid = new Grid(this.boardWidth, SubterraneaGame.GRID_SIZE);

    this.player = new Player(this, SubterraneaGame.PLAYER_SPEED);
    this.placePlayer();
    this.playerHealthUpdate(this.player.health);

    this.actors = [];
    this.objects = [];
    this.sinkhole = new SinkHole(this);
    this.sinkhole.newContainer(this.grid.container[0][0]);
    this.refreshBoard(SubterraneaGame.ROCK_AMOUNT);

    this.assets = {};
    this.loadAssets();

    this.bombPower = 1;
    this.bombPowerUpdate(this.bombPower);
    this.bombDamage = 1;
    this.bombFuseTime = 3000;

    this.resources = 3;
    this.resourceUpdate(this.resources);
    this.resourceDowntickId = setInterval(() => {
      this.resources -= 1;
      this.resourceUpdate(this.resources);
    }, SubterraneaGame.RESOURCE_DOWNTICK_INTERVAL);

    this.loopId = setInterval(
      () => this.gameLoop(),
      SubterraneaGame.REFRESH_MILLISECONDS
    );
  }

  gameLoop() {
    if (this.resources === 0) this.endGame(false);
    else if (this.resources === SubterraneaGame.RESOURCE_VICTORY)
      this.endGame(true);
    this.player.move(this.boardWidth);
    this.moveActors();
    this.draw();
  }

  draw() {
    //draw the board
    this.assets[ASSET_TAGS.BOARD]();
    this.assets[ASSET_TAGS.SINKHOLE]();
    // console.log(this.objects.map((object) => object.position));
    this.objects.forEach((object) => this.assets[object.asset](object));
    //draw terrain
    // this.rocks.forEach((rock) => this.assets[rock.asset](rock));
    //draw monsters
    this.actors.forEach((actor) => this.assets[actor.asset](actor));
    //draw player
    this.assets[ASSET_TAGS.PLAYER]();
  }

  loadAssets() {
    this.assets[ASSET_TAGS.BOARD] = () => {
      this.context.fillStyle = "rgb(47, 36, 84)";
      this.context.fillRect(0, 0, this.boardWidth, this.boardHeight);
    };

    this.placeHolderAsset(
      ASSET_TAGS.SINKHOLE,
      "rgb(0, 0, 0)",
      this.sinkhole,
      true
    );

    this.placeHolderAsset(
      ASSET_TAGS.PLAYER,
      "rgb(66, 235, 218)",
      this.player,
      true
    );

    this.placeHolderAsset(
      ASSET_TAGS.ROCK,
      "rgb(122, 84, 34)",
      this.objects,
      false
    );

    this.placeHolderAsset(
      ASSET_TAGS.BOMB,
      "rgb(140, 36, 36)",
      this.actors,
      false
    );

    this.placeHolderAsset(
      ASSET_TAGS.FIRE,
      "rgb(247, 71, 27)",
      this.objects,
      false
    );

    this.placeHolderAsset(
      ASSET_TAGS.GUNPOWDER,
      "rgb(128, 113, 113)",
      this.objects,
      false
    );

    this.placeHolderAsset(
      ASSET_TAGS.UNOBTAINIUM,
      "rgb(219, 212, 68)",
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

  refreshBoard(numRocks) {
    const objectPlacements = new Shuffler(
      this.getObstaclePlacementsAround(
        this.player.container.gridY,
        this.player.container.gridX,
        1
      )
    );
    const sinkHoleRockId = Math.floor(numRocks * Math.random());
    for (let id = 0; id < numRocks; id++) {
      const index = objectPlacements.drawNext();
      if (this.grid.container[index.y][index.x].contains(TYPE_TAGS.ROCK) > -1)
        console.log("multiple rocks in the same place");
      this.spawnObject(
        Rock,
        [this, ASSET_TAGS.ROCK, TYPE_TAGS.ROCK, id],
        [this.grid.container[index.y][index.x]]
      );
      if (id === sinkHoleRockId) {
        console.log(`new sinkhole location`);
        this.sinkhole.transitionToNewContainer(
          this.grid.container[index.y][index.x]
        );
        console.log(
          `sinkhole: ${this.sinkhole.position.x},${this.sinkhole.position.y}`
        );
      }
    }
  }

  placePlayer() {
    const playerGridX = Math.floor(SubterraneaGame.GRID_SIZE * Math.random());
    const playerGridY = Math.floor(SubterraneaGame.GRID_SIZE * Math.random());
    this.player.newContainer(this.grid.container[playerGridY][playerGridX]);
    this.player.snapToGrid();
  }

  placeSinkhole() {
    const placementShuffler = new Shuffler(
      this.getObstaclePlacementsAround(
        this.player.container.gridY,
        this.player.container.gridX,
        1
      )
    );
    const sinkholePosition = placementShuffler.drawNext();
    this.sinkhole.newContainer(
      this.grid.container[sinkholePosition.y][sinkholePosition.x]
    );
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
      } else {
        instance.id = this.objects.length;
        this.objects.push(instance);
      }

      console.log(
        `spawned object: ${instance.asset} ${instance.type} ${instance.id} at: ${instance.container.gridX} ${instance.container.gridY} (${instance.position.x}, ${instance.position.y})`
      );
    });
  }

  destroy(object) {
    object.clearTimeouts();
    if (object.container.remove(object) === false)
      console.log(`failed to remove ${object.type}`);
    this.player.refreshNearbyObjects();
    this.actors.forEach((actor) => actor.refreshNearbyObjects());
    if (object instanceof Actor) this.remove(object, this.actors);
    else if (object instanceof GameObject) this.remove(object, this.objects);
  }

  remove(object, collection) {
    if (collection.includes(object)) {
      for (let id = object.id + 1; id < collection.length; id++) {
        collection[id].id -= 1;
      }
      collection.splice(object.id, 1);
    }
  }

  playerPickedUp(object) {
    // console.log(`player picked up: ${object.type}`);
    switch (object.type) {
      case TYPE_TAGS.POWERUP:
        this.bombPower += 1;
        this.bombFuseTime -= 500;
        this.bombPowerUpdate(this.bombPower);
        break;
      case TYPE_TAGS.RESOURCE:
        this.resources += 1;
        this.resourceUpdate(this.resources);
        break;
      default:
        break;
    }
    this.destroy(object);
  }

  playerEnteredSinkhole() {
    this.clearBoard();
    this.player.snapToGrid();
    this.refreshBoard(SubterraneaGame.ROCK_AMOUNT);
  }

  playerDied() {
    this.endGame(false);
  }

  endGame(result) {
    clearTimeout(this.resourceDowntickId);
    this.gameEndUpdate(result);
    setTimeout(() => clearTimeout(this.loopId), 1000);
  }

  clearBoard() {
    this.grid.clear();
    this.clearRenderGroup(this.actors);
    this.clearRenderGroup(this.objects);
    this.player.refreshNearbyObjects();
  }

  clearRenderGroup(group) {
    for (let i = 0; i < group.length; i++) {
      group.pop();
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
