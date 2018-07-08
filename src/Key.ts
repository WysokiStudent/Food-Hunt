export class Key {
    code: number;
    isDown: boolean;
    isUp: boolean;
    press: () => void;
    release: () => void;

    constructor(keyCode: number) {
      this.code = keyCode;
      this.isDown = false;
      this.isUp = true;
      this.press = (): void => {}
      this.release = (): void => {}
    }

    downHandler(event: KeyboardEvent): void {
      if (event.keyCode === this.code) {
        if (this.isUp && this.press) {
          this.press();
        }
        this.isDown = true;
        this.isUp = false;
      }
      event.preventDefault();
    };

    upHandler(event: KeyboardEvent): void {
      if (event.keyCode === this.code) {
        if (this.isDown && this.release) {
          this.release();
        }
        this.isDown = false;
        this.isUp = true;
      }
      event.preventDefault();
    };
}
