import * as PIXI from 'pixi.js';
import { Hero }  from "./Hero";
import { HeroTextures } from './HeroTextures';
import { Key } from './Key';
import { Food } from './Food';
import { HealthBar } from './HealthBar';
import { ScoreBar } from './ScoreBar';

export class FoodHunter {
  app!: PIXI.Application;
  gameScene: PIXI.Container = new PIXI.Container();
  gameOverScene: PIXI.Container = new PIXI.Container();
  healthBar: HealthBar;
  scoreBar: ScoreBar;
  hero?: Hero;
  heroLocation: string = "graphics/hero/Hero.json";
  food?: Food;
  foodLocation: string = "graphics/FreePixelFood/Food.json";

  updateState: (delta: number) => void = this.play;

  constructor() {
    this.constructApplication();
    this.constructGameOverScene();
    this.constructFood();
    this.constructHero();
    this.healthBar = new HealthBar(
      this.app.view.width / 4,
      this.app.view.height / 20
    )
    this.healthBar.position.set(this.app.view.width - this.healthBar.width, 0);
    this.gameScene.addChild(this.healthBar);

    this.scoreBar = new ScoreBar()
    this.gameScene.addChild(this.scoreBar);

    this.app.loader.load(
      (): void => {
        this.loadFood();
        this.loadHero();
      }
    )
  }

  startGameLoop(): void {
    this.app.ticker
    .add(
      (delta: number): void => this.gameLoop(delta)
    )
    .add(
      (delta: number): void => {
        if(Math.floor(Math.random() * 100) >= 98) {
          this.generateFallingFood();
        }
      }
    );
    this.app.stage = this.gameScene;
  }

  stopGameLoop(): void {
    this.app.ticker.stop();
  }

  generateFallingFood(): void {
    if(this.food) {
      this.food.generateFallingFood(this.app.view.width);
    }
  }

  private constructApplication(): void {
    this.app = new PIXI.Application(300, 400);
    document.body.appendChild(this.app.view);

    this.app.renderer.backgroundColor = 0xFFFFFF;

  }

  private constructGameOverScene(): void {
    let message: PIXI.Text = new PIXI.Text("Game Over");
    message.position.set(
      this.app.view.width / 2 - message.width / 2,
      this.app.view.height / 2 - message.height / 2,
    )
    this.gameOverScene.addChild(message);
  }

  private constructHero(): void {
    this.app.loader.add(this.heroLocation);
  }

  private loadHero(): void {
    let heroTextures: HeroTextures = new HeroTextures();
    let textures: PIXI.loaders.TextureDictionary | undefined =
    this.app.loader.resources[this.heroLocation].textures;
    if(textures) {
      heroTextures = this.createHeroTextures(textures);
      this.hero = new Hero(heroTextures);
      this.gameScene.addChild(this.hero);
      this.hero.y = this.app.view.height - this.hero.height;
      this.assignMovementKeysToHero();
    }
  }

  private constructFood(): void {
    this.app.loader.add(this.foodLocation);
  }

  private loadFood(): void {
    let textures: PIXI.loaders.TextureDictionary | undefined =
    this.app.loader.resources[this.foodLocation].textures;
    if(textures) {
      this.food = new Food(textures);
    }
    if(this.food) {
      this.gameScene.addChild(this.food);
    }
  }

  private loadFrames(
    textures: PIXI.loaders.TextureDictionary,
    frameName: string,
    frameCount: number,
    suffix: string
  ): PIXI.Texture[] {
    let frames: PIXI.Texture[] = [];
    for(let frameNumber: number = 0; frameNumber < frameCount; ++frameNumber) {
      let key: string = frameName + frameNumber + suffix;
      frames.push(textures[key]);
    }

    return frames;
  }

  private createHeroTextures(
    textures: PIXI.loaders.TextureDictionary
  ): HeroTextures {
    let imageFrames: { frameName: string, frameCount: number }[] = [
      { frameName: "knight iso char_idle_", frameCount: 4 },
      { frameName: "knight iso char_run left_", frameCount: 6 },
      { frameName: "knight iso char_run right_", frameCount: 6 },
      { frameName: "knight iso char_slice left_", frameCount: 3 },
      { frameName: "knight iso char_slice right_", frameCount: 3 },
      { frameName: "knight iso char_slice up_", frameCount: 3 }
    ]
    let suffix: string = ".png";
    let heroTextures: HeroTextures = new HeroTextures();
    let texturesArray: Array<PIXI.Texture[]> = heroTextures.getArray();
    for(let index: number = 0; index < texturesArray.length; index++) {
      texturesArray[index] = this.loadFrames(
        textures,
        imageFrames[index].frameName,
        imageFrames[index].frameCount,
        suffix
      );
    }
    heroTextures.setArray(texturesArray);
    return heroTextures;
  }

  private assignMovementKeysToHero(): void {
    let left = this.keyboard(37), right = this.keyboard(39);

    left.press = () => {
      if(this.hero) {
        this.hero.runLeft();
        this.hero.vx = -5;
        this.hero.vy = 0;
      }
    }

    left.release = () => {
      if(this.hero) {
        if(!right.isDown && this.hero.vy === 0) {
          this.hero.idle();
          this.hero.vx = 0;
        }
      }
    }

    right.press = () => {
      if(this.hero) {
        this.hero.runRight();
        this.hero.vx = 5;
        this.hero.vy = 0;
      }
    }

    right.release = () => {
      if(this.hero) {
        if(!left.isDown && this.hero.vy === 0) {
          this.hero.idle();
          this.hero.vx = 0;
        }
      }
    }
  }

  private gameLoop(delta: number): void {
    this.updateState(delta);
  }

  private play(delta: number): void {
    this.advanceHero();
    this.advanceFood();
    this.handleFoodHeroCollisions();
  }

  private advanceHero(): void {
    if(this.hero) {
      this.hero.advance();
      this.contain(this.hero, this.app.screen);
    }
  }

  private advanceFood(): void {
    if(this.food) {
      this.food.advance();
      this.food.fallingFoods.forEach(
        (concreteFood: PIXI.Sprite): void => {
          this.handleFallingFood(concreteFood);
        }
      );
    }
  }

  private handleFallingFood(concreteFood: PIXI.Sprite): void {
    let collision: string | undefined = this.contain(
      concreteFood,
      this.app.screen
    );
    if(this.food && collision === "bottom") {
      this.food.removeChild(concreteFood);
      this.food.removeConcreteFood(concreteFood);
      this.healthBar.decreaseHealth();
      if(this.healthBar.healthLeft === 0) {
        this.app.stage = this.gameOverScene;
        this.stopGameLoop();
      }
    }
  }

  private handleFoodHeroCollisions(): void {
    if(this.food) {
      this.food.fallingFoods.forEach(
        (concreteFood: PIXI.Sprite): void => {
          this.handlConcreteFoodHeroCollisions(concreteFood);
        }
      );
    }
  }

  private handlConcreteFoodHeroCollisions(concreteFood: PIXI.Sprite): void {
    if(this.hero) {
      if(this.hitTestSprite(this.hero, concreteFood)) {
        if(this.food) {
          this.food.removeChild(concreteFood);
          this.food.removeConcreteFood(concreteFood);
          if(concreteFood.y < this.hero.getHeadY() && this.hero.vx === 0) {
            this.hero.sliceUp();
          } else if(concreteFood.x < this.hero.x + (this.hero.width / 2)) {
            this.hero.sliceLeft();
          } else {
            this.hero.sliceRight();
          }
          this.scoreBar.increaseScore();
        }
      }
    }
  }

  private keyboard(keyCode: number): Key {
    let key: Key = new Key(keyCode);

    window.addEventListener("keydown", key.downHandler.bind(key), false);
    window.addEventListener("keyup", key.upHandler.bind(key), false);
    return key;
  }

  private contain(
    sprite: PIXI.Sprite,
    container: {
      x: number,
      y: number,
      width: number,
      height: number
    }
  ): string | undefined {
    let collision: string | undefined = undefined;

    if(sprite.x < container.x) {
      sprite.x = container.x;
      collision = "left";
    }

    if(sprite.y < container.y) {
      sprite.y = container.y;
      collision = "top";
    }

    if(sprite.x + sprite.width > container.width) {
      sprite.x = container.width - sprite.width;
      collision = "right";
    }

    if(sprite.y + sprite.height > container.height) {
      sprite.y = container.height - sprite.height;
      collision = "bottom";
    }

    return collision;
  }

  private hitTestSprite(
    r1: PIXI.Sprite,
    r2: PIXI.Sprite):  boolean {
      let hit: boolean = false;

      let r1centerX: number = r1.x + r1.width / 2;
      let r1centerY: number = r1.y + r1.height / 2;
      let r2centerX: number = r2.x + r2.width / 2;
      let r2centerY: number = r2.y + r2.height / 2;

      let r1halfWidth: number = r1.width / 2;
      let r1halfHeight: number = r1.height / 2;
      let r2halfWidth: number = r2.width / 2;
      let r2halfHeight: number = r2.height / 2;

      let vx: number = r1centerX - r2centerX;
      let vy: number = r1centerY - r2centerY;

      let combinedHalfWidths: number = r1halfWidth + r2halfWidth;
      let combinedHalfHeights: number = r1halfHeight + r2halfHeight;

      if (Math.abs(vx) < combinedHalfWidths) {
        if (Math.abs(vy) < combinedHalfHeights) {
          hit = true;
        } else {
          hit = false;
        }
      } else {
        hit = false;
      }

      return hit;
    }
  }
