export class Food extends PIXI.particles.ParticleContainer {
  textures: PIXI.loaders.TextureDictionary;
  textureCount: number;
  fallingFoods: PIXI.Sprite[];

  constructor(textures: PIXI.loaders.TextureDictionary) {
    super();
    this.textures = textures;
    this.textureCount = this.getTextureCount();
    this.fallingFoods = new Array<PIXI.Sprite>();
  }

  advance(): void {
    this.fallingFoods.forEach((sprite) => {
      sprite.y += 3;
    })
  }

  generateFallingFood(ceilingWidth: number): void {
    let concreteFood = new PIXI.Sprite(this.getRandomTexture());
    concreteFood.x = Math.floor(Math.random() * (ceilingWidth + 1));
    this.fallingFoods.push(concreteFood);
    this.addChild(this.fallingFoods[this.fallingFoods.length - 1]);
  }

  getRandomTexture(): PIXI.Texture | undefined {
    let randomIndex: number = Math.floor(Math.random() * this.textureCount + 1);
    let index:number = 0;
    let randomTexture: PIXI.Texture | undefined = undefined;
    for(let key in this.textures) {
      if(index === randomIndex) {
        randomTexture = this.textures[key];
      }
      index++;
    }
    return randomTexture;
  }

  removeFallingFood(sprite: PIXI.Sprite): void {
    let index = this.fallingFoods.indexOf(sprite);
    if(index > -1) {
      this.fallingFoods.splice(index, 1);
    }
  }

  getTextureCount(): number {
    let textureCount: number = 0;
    for(let key in this.textures) {
      textureCount++;
    }
    return textureCount;
  }
}
