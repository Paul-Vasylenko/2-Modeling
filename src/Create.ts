import Element from "./Element";
import { ChooseNextElementBy } from "./types/choose-next-el";
import { IDelay } from "./types/delay";
import { DistributionType } from "./types/distribution";

class Create extends Element {
  constructor(
    delay: IDelay,
    nameOfElement?: string,
    options: {
      distribution: DistributionType;
      chooseType: ChooseNextElementBy;
    } = { distribution: "exp", chooseType: "priority" }
  ) {
    super(delay, nameOfElement);
    super.setDistribution(options.distribution);
    super.setTnext(0);
    this.chooseType = options.chooseType;
  }

  public outAct(): void {
    super.outAct();
    super.setTnext(super.getTcurr() + super.getDelay());
    const el = super.getNextElement();
    if (el) {
      el.inAct();
    }
  }
}

export default Create;
