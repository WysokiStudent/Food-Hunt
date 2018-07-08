import * as PIXI from 'pixi.js';
import { HeroTextures } from './HeroTextures';

export class Hero extends PIXI.extras.AnimatedSprite {
  animationSpeed = 0.15;
  vx: number = 0;
  vy: number = 0;

  heroTextures: HeroTextures;

  constructor(heroTextures: HeroTextures) {
    super(heroTextures.idle);
    this.heroTextures = heroTextures;
  }

  idle(): void {
    this.textures = this.heroTextures.idle;
    this.play();
  }

  runLeft(): void {
    this.changeTexture(this.heroTextures.runLeft);
  }

  runRight(): void {
    this.changeTexture(this.heroTextures.runRight);
  }

  sliceLeft(): void {
    this.changeTexture(this.heroTextures.sliceLeft);
  }

  sliceRight(): void {
    this.changeTexture(this.heroTextures.sliceRight);
  }

  sliceUp(): void {
    this.changeTexture(this.heroTextures.sliceUp);
  }

  advance(): void {
    this.x += this.vx;
    this.y += this.vy;
  }

  private changeTexture(textures: PIXI.Texture[]): void {
    if(this.textures !== textures) {
      this.textures = textures;
      this.play();
    }
  }
}
