import FunRand from "./FunRand";

export type DistributionType = "exp";

type ChooseNextElementBy = "probability" | "priority";
export interface NextElement {
  element: Element;
  probability: number;
  priority: number;
}
class Element {
  private chooseType: ChooseNextElementBy = "priority";
  private name: string;
  private tnext: number;
  private delayMean: number;
  private distribution: DistributionType;
  private quantity: number = 0;
  private tcurr: number;
  private state: number;
  private nextElements: NextElement[];
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

    console.log(`id=${this.getId()}`);
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

  public setNextElements(nextElements: NextElement[]) {
    if (this.chooseType === "probability") {
      const sumprob = nextElements.reduce(
        (prev, curr) => prev + curr.probability,
        0
      );
      if (sumprob !== 1) throw new Error(`Total prob must be 1: ${this.name}`);
    }
    this.nextElements = nextElements;
  }

  public getNextElements() {
    return this.nextElements;
  }

  public getNextElement() {
    if (!this.nextElements.length) return null;
    if (this.nextElements.length === 1) return this.nextElements[0].element;

    if (this.chooseType === "probability") {
      return this.chooseByProbability();
    }

    if (this.chooseType === 'priority') {
      return this.chooseByPriority();
    }
  }

  private chooseByProbability() {
    const rand = Math.random();
      const probs: number[] = [];
      let i = 0;
      for (const el of this.nextElements) {
        const prob = i === 0 ? el.probability : el.probability + probs[i - 1];
        probs.push(prob);
        i++;
      }

      let nextEl;

      for (i = 0; i < probs.length; i++) {
        if (i === 0 && rand < probs[i]) {
          nextEl = this.nextElements[i].element;
          break;
        }
        if (i === probs.length - 1 && rand >= probs[i]) {
          nextEl = this.nextElements[i].element;
          break;
        }
        if (rand >= probs[i] && rand < probs[i + 1]) {
          nextEl = this.nextElements[i+1].element;
          i++
          break;
        }
      }

      return nextEl;
  }

  private chooseByPriority() {
    const free = this.nextElements.filter(el => el.element.isFree());
    free.sort((e1, e2) => e2.priority - e1.priority)
    
    return free[0]?.element;
  }

  public isFree() {
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
