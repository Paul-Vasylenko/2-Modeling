import FunRand from "./FunRand";

type DistributionType = "exp";
class Element {
  private name: string;
  private tnext: number;
  private delayMean: number;
  // private delayDev: number; // Needed in other distributions
  private distribution: DistributionType;
  private quantity: number = 0;
  private tcurr: number;
  private state: number;
  private nextElements: Element[];
  private static nextId = 0;
  private id: number;

  constructor(delay?: number, nameOfElement?: string) {
    this.tnext = Infinity;
    this.delayMean = delay || 1.0;
    this.distribution = "exp";
    this.tcurr = this.tnext;
    this.state = 0;
    this.nextElements = [];
    this.id = Element.nextId;
    Element.nextId++;
    this.name = nameOfElement || `element_${this.id}`;
  }

  public getDelay() {
    let delay = this.getDelayMean();
    switch (this.distribution) {
      case "exp":
        delay = FunRand.exponential(delay);
        break;
      default:
        throw new Error("Wrong distribution type!");
    }

    return delay;
  }

  public addNextElement(nextElement: Element) {
    this.nextElements.push(nextElement);
  }

  public getNextElements() {
    return this.nextElements;
  }

  public getNextElement() {
    if (!this.nextElements.length) return null;
    if (this.nextElements.length === 1) return this.nextElements[0];

    const total = this.nextElements.length;
    const rand = Math.random();
    const step = 1 / total;

    for (let i = 0; i < total; i++) {
      if (rand >= i * step || rand < (i + 1) * step) {
        const foundEvent = this.nextElements[i];
        // if(foundEvent)
        return foundEvent;
      }
    }
  }

  public getDistribution(): DistributionType {
    return this.distribution;
  }

  public setDistribution(d: DistributionType) {
    this.distribution = d;
  }

  public getQuantity() {
    return this.quantity;
  }

  public getTcurr() {
    return this.tcurr;
  }

  public setTcurr(tcurr: number) {
    this.tcurr = tcurr;
  }

  public getState() {
    return this.state;
  }

  public setState(state: number) {
    this.state = state;
  }

  public inAct() {}

  public outAct() {
    this.quantity++;
  }

  public getTnext() {
    return this.tnext;
  }

  public setTnext(tnext: number) {
    this.tnext = tnext;
  }

  public getDelayMean() {
    return this.delayMean;
  }

  public setDelayMean(delay: number) {
    this.delayMean = delay;
  }

  public getId() {
    return this.id;
  }

  public setId(id: number) {
    this.id = id;
  }

  public getName() {
    return this.name;
  }

  public setName(name: string) {
    this.name = name;
  }

  public printResult() {
    console.log(`${this.getName()} quantity=${this.getQuantity()}`);
  }

  public printInfo() {
    console.log(
      `${this.getName()} | state=${this.state} | quantity=${
        this.quantity
      } | tnext=${this.tnext}`
    );
  }

  public doStatistics(delta?: number) {}
}

export default Element;
