import Element from "./Element";
import { ChooseNextElementBy } from "./types/choose-next-el";
import { IClientType } from "./types/client-types";
import { IDelay } from "./types/delay";
import { DistributionType } from "./types/distribution";

class Create extends Element {
  constructor(
    delay: IDelay,
    nameOfElement?: string,
    options: {
      distribution: DistributionType;
      chooseType: ChooseNextElementBy;
      clientTypes: IClientType[];
    } = { distribution: "exp", chooseType: "priority", clientTypes: [] }
  ) {
    super(delay, nameOfElement);
    super.setDistribution(options.distribution);
    super.setTnext(0);
    const sumFreq = options.clientTypes.reduce(
      (prev, curr) => prev + curr.freq,
      0
    );
    if (sumFreq !== 1) throw new Error("Frequency sum is not equal to 1");
    this.clientTypes = options.clientTypes;
    this.chooseType = options.chooseType;
  }

  public outAct(): void {
    super.outAct();
    let random = Math.random();
    let clientType = this.clientTypes[0];
    for (const type of this.clientTypes) {
      if (random < type.freq) {
        clientType = type;
      }
      random -= type.freq;
    }
    super.setTnext(super.getTcurr() + super.getDelay());
    const el = super.getNextElement();
    if (el) {
      el.setClientType(clientType)
      el.inAct();
    }
  }
}

export default Create;
