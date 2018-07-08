export class HealthBar extends PIXI.Container{
  innerBar: PIXI.Graphics;
  outerBar: PIXI.Graphics;
  healthLeft: number = 10;
  oneHealthWidth: number;

  constructor(width: number, heigh: number) {
    super();
    this.innerBar = new PIXI.Graphics();
    this.innerBar.beginFill(0x000000);
    this.innerBar.drawRect(0, 0, width, heigh);
    this.innerBar.endFill();
    this.addChild(this.innerBar);

    this.outerBar = new PIXI.Graphics();
    this.outerBar.beginFill(0xFF3300);
    this.outerBar.drawRect(0, 0, width, heigh);
    this.outerBar.endFill();
    this.addChild(this.outerBar);

    this.oneHealthWidth = width / this.healthLeft;
  }

  decreaseHealth(): void {
    this.healthLeft--;
    this.outerBar.width = this.healthLeft * this.oneHealthWidth;
  }

}
