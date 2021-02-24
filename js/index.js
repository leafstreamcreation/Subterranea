window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  const game = new SubterraneaGame(canvas, context);
  document.addEventListener("keydown", (e) => game.handleKeyDown(e.key));
  document.addEventListener("keyup", (e) => game.handleKeyUp(e.key));
});
