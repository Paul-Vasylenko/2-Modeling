import Element from "./Element";
import { IDelay } from "./types/delay";

export default class Dispose extends Element {
  constructor(delay: IDelay, nameOfElement?: string) {
    super(delay, nameOfElement);
  }

  public inAct() {
    this.outAct();
  }
}
