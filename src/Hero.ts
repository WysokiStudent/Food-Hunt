import * as PIXI from 'pixi.js';
import { HeroTextures } from './HeroTextures';

export class Hero extends PIXI.extras.AnimatedSprite {
  animationSpeed: number = 0.15;
  movementSpeed: number = 5;
  vx: number = 0;
  vy: number = 0;

  heroTextures: HeroTextures;
  headToBodyRatio: number = 1/8;

  constructor(heroTextures: HeroTextures) {
    super(heroTextures.idle);
    this.heroTextures = heroTextures;
    this.onLoop = this.softlyResetAnimation;
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
    if(this.vx < 0) {
      this.changeTexture(this.heroTextures.sliceLeft);
    }
  }

  sliceRight(): void {
    if(this.vx > 0) {
      this.changeTexture(this.heroTextures.sliceRight);
    }
  }

  sliceUp(): void {
    if(this.vx === 0) {
      this.changeTexture(this.heroTextures.sliceUp);
    }
  }

  advance(): void {
    this.x += this.vx;
    this.y += this.vy;
  }

  getHeadY(): number {
    return this.y + this.height * this.headToBodyRatio;
  }

  private changeTexture(textures: PIXI.Texture[]): void {
    if(this.textures !== textures) {
      this.textures = textures;
      this.play();
    }
  }

  private softlyResetAnimation(): void {
    if(this.vx === 0 && this.vy === 0) {
      this.idle();
    } else if(this.vx > 0) {
      this.runRight();
    } else {
      this.runLeft();
    }
  }
}
