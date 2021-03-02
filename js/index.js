window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  const game = new SubterraneaGame(
    canvas,
    context,
    (r) => gameEnd(r),
    (p) => bombPowerChanged(p),
    (r) => resourcesChanged(r),
    (h) => playerHealthChanged(h)
  );
  document.addEventListener("keydown", (e) => game.handleKeyDown(e.key));
  document.addEventListener("keyup", (e) => game.handleKeyUp(e.key));
  document.getElementById(
    "resource-goal"
  ).innerHTML = `${SubterraneaGame.RESOURCE_VICTORY}`;
});

function gameEnd(victory) {}

function playerHealthChanged(newHealth) {
  const healthDisplay = document.querySelector("#health");
  healthDisplay.innerHTML = `${newHealth}`;
}

function resourcesChanged(newResources) {
  const resourceDisplay = document.querySelector("#resources");
  resourceDisplay.innerHTML = `${newResources}`;
}

function bombPowerChanged(newBombPower) {
  const bombPowerDisplay = document.querySelector("#bomb-power");
  bombPowerDisplay.innerHTML = `${newBombPower}`;
}
