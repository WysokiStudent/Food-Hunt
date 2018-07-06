export class HeroTextures {
  idle: PIXI.Texture[] = [];
  runLeft: PIXI.Texture[] = [];
  runRight: PIXI.Texture[] = [];
  sliceLeft: PIXI.Texture[] = [];
  sliceRight: PIXI.Texture[] = [];
  sliceUp: PIXI.Texture[] = [];

  getArray(): Array<PIXI.Texture[]> {
    let array: Array<PIXI.Texture[]> = [];
    array.push(this.idle);
    array.push(this.runLeft);
    array.push(this.runRight);
    array.push(this.sliceLeft);
    array.push(this.sliceRight);
    array.push(this.sliceUp);

    return array;
  }

  setArray(textures: Array<PIXI.Texture[]>): void {
    this.idle = textures[0];
    this.runLeft = textures[1];
    this.runRight = textures[2];
    this.sliceLeft = textures[3];
    this.sliceRight = textures[4];
    this.sliceUp = textures[5];
  }

  constructor() {}
}
