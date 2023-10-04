import Element, { DistributionType } from "./Element";

class Create extends Element {
  constructor(
    delay?: number,
    nameOfElement?: string,
    options: {
      distribution: DistributionType;
    } = { distribution: "exp" }
  ) {
    super(delay, nameOfElement);
    super.setDistribution(options.distribution);
    super.setTnext(0.0);
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
