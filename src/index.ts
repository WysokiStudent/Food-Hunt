import * as PIXI from 'pixi.js';

let app:PIXI.Application = new PIXI.Application();
document.body.appendChild(app.view);

app.renderer.backgroundColor = 0xFFFFFF;

let message: PIXI.Text = new PIXI.Text(
  "Hello Pixi",
  {
    fontFamily: "Times new Roman",
    fontSize: 46,
    align: "center"
  });

app.stage.addChild(message);
