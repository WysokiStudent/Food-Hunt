import * as PIXI from 'pixi.js';
import { Hero }  from "./Hero";
import { HeroTextures } from './HeroTextures';

export class FoodHunter {
  app!: PIXI.Application;
  hero!: Hero;

  constructor() {
    this.constructApplication();
    this.constructHero();
  }

  constructApplication(): void {
    this.app = new PIXI.Application();
    document.body.appendChild(this.app.view);

    this.app.renderer.backgroundColor = 0xFFFFFF;
    }

  constructHero(): void {
    this.hero = new Hero(this.loadHeroTextures());
    this.app.stage.addChild(this.hero);
  }

  play(): void {
    this.hero.play();
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
    let imageFrames: {frameName: string, frames: number}[] = [
      { frameName: "knight iso char_idle_", frames: 4 },
      { frameName: "knight iso char_run left_", frames: 6 },
      { frameName: "knight iso char_run right_", frames: 6 },
      { frameName: "knight iso char_slice left_", frames: 3 },
      { frameName: "knight iso char_slice right_", frames: 3 },
      { frameName: "knight iso char_slice up_", frames: 3}
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
}
