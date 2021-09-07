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
  showMessage(
    "You're stuck underground! Gather resources for your transport home... before it melts down!",
    10000
  );
});

function gameEnd(victory) {
  if (victory)
    showMessage("You refueled your transport and made it back home!", 10000);
  else {
    if (playerExploded)
      showMessage("You blew yourself up trying to make it back home", 10000);
    else
      showMessage(
        "Your transport's engine went critical and you cannot make it back home",
        10000
      );
  }
  setTimeout(() => showMessage("Refresh to play again!", 10000), 10000);
}

let playerExploded = false;

function playerHealthChanged(newHealth) {
  const healthDisplay = document.querySelector(".health-display");
  if (newHealth < 2) healthDisplay.style.color = "red";
  else healthDisplay.style.color = "black";

  const health = document.querySelector("#health");
  health.innerHTML = `${newHealth}`;
  if (newHealth === 0) playerExploded = true;
  showMessage("Ouch!", 3000);
}

let oldResources = 3;

function resourcesChanged(newResources) {
  const resourceDisplay = document.querySelector(".resource-display");
  if (newResources < 3) resourceDisplay.style.color = "red";
  else resourceDisplay.style.color = "black";

  const resource = document.querySelector("#resources");
  resource.innerHTML = `${newResources}`;
  if (newResources > oldResources) {
    showMessage("Fuel collected!", 3000);
  }
  oldResources = newResources;
}

function bombPowerChanged(newBombPower) {
  const bombPowerDisplay = document.querySelector(".bomb-power-display");
  if (newBombPower > 4) bombPowerDisplay.style.color = "red";
  const bombPower = document.querySelector("#bomb-power");
  bombPower.innerHTML = `${newBombPower}`;
  showMessage("Bomb Danger Up!", 3000);
}

let messageTimeoutId;

function showMessage(message, timeout) {
  const messageDisplay = document.querySelector("#message-field");
  messageDisplay.innerHTML = message;
  if (messageTimeoutId !== null) clearTimeout(messageTimeoutId);
  messageTimeoutId = setTimeout(() => {
    messageDisplay.innerHTML = "";
    messageTimoutId = null;
  }, timeout);
}
