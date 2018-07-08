import * as PIXI from 'pixi.js';
import { Hero }  from "./Hero";
import { HeroTextures } from './HeroTextures';
import { Key } from './Key';
import { Food } from './Food';

export class FoodHunter {
  app!: PIXI.Application;
  hero?: Hero;
  food?: Food;

  updateState: (delta: number) => void = this.play;

  constructor() {
    this.constructApplication();
    this.constructFood();
    this.constructHero();
  }

  startGameLoop(): void {
    this.app.ticker
    .add(
      (delta) => this.gameLoop(delta)
    )
    .add(
      (delta) => {
        if(Math.floor(Math.random() * 100) >= 98) {
          this.generateFallingFood();
        }
      }
    );
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

  private constructHero(): void {
    this.hero = new Hero(this.loadHeroTextures());
    this.app.stage.addChild(this.hero);
    this.assignMovementKeysToHero();
  }

  private constructFood(): void {
    let foodLocation = "graphics/FreePixelFood/Food.json";
    this.app.loader.add(foodLocation).load(
      () => {
        let textures: PIXI.loaders.TextureDictionary | undefined =
        this.app.loader.resources[foodLocation].textures;
        if(textures) {
          this.food = new Food(textures);
        }
        if(this.food) {
          this.app.stage.addChild(this.food);
        }
      }
    );
}

  private loadTextures(
    location: string,
    frameName: string,
    frames: number,
    suffix: string): PIXI.Texture[] {
      let textures: PIXI.Texture[] = [];
      for(let frameNumber: number = 0; frameNumber < frames; ++frameNumber) {
        let image = location + frameName + frameNumber + suffix;
        textures.push(PIXI.Texture.fromImage(image));
      }

      return textures;
    }

  private loadHeroTextures(): HeroTextures {
    let imageLocation: string = "graphics/hero/";
    let imageSufix: string = ".png";
    let imageFrames: { frameName: string, frames: number }[] = [
      { frameName: "knight iso char_idle_", frames: 4 },
      { frameName: "knight iso char_run left_", frames: 6 },
      { frameName: "knight iso char_run right_", frames: 6 },
      { frameName: "knight iso char_slice left_", frames: 3 },
      { frameName: "knight iso char_slice right_", frames: 3 },
      { frameName: "knight iso char_slice up_", frames: 3 }
    ]
    let textures: HeroTextures = new HeroTextures();
    let texturesArray: Array<PIXI.Texture[]> = textures.getArray();
    for(let index: number = 0; index < texturesArray.length; index++) {
      texturesArray[index] = this.loadTextures(
        imageLocation,
        imageFrames[index].frameName,
        imageFrames[index].frames,
        imageSufix
      );
    }
    textures.setArray(texturesArray);
    return textures;
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
    if(this.hero) {
      this.hero.advance();
      this.contain(this.hero, this.app.screen);
    }

    if(this.food) {
      this.food.advance();
      this.food.fallingFoods.forEach(
        (sprite) => {
          let collision: string | undefined = this.contain(
            sprite,
            this.app.screen
          );
          if(this.food && collision === "bottom") {
            this.food.removeChild(sprite);
            this.food.removeFallingFood(sprite);
          }
        }
      );
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

}
