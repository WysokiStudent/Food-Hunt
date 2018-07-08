export class ScoreBar extends PIXI.Text {
  label: string = "Score:";
  score: number = 0;
  constructor() {
    super();
    this.updateScore()
  }

  increaseScore(): void {
    ++this.score;
    this.updateScore()
  }

  updateScore(): void {
    this.text = this.label + this.score;
  }
}
