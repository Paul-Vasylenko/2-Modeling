import FunRand from "./FunRand";
import { ChooseNextElementBy } from "./types/choose-next-el";
import { IDelay } from "./types/delay";
import { DistributionType } from "./types/distribution";
import { NextElement, isByPriority, isByProb } from "./types/nest-element";

class Element {
  protected chooseType: ChooseNextElementBy = "priority";
  private name: string;
  private tnext: number;
  private delayMean: number;
  private minDelay: number;
  private maxDelay: number;
  private delayDev: number;
  private distribution: DistributionType;
  private quantity: number = 0;
  private tcurr: number;
  private state: number;
  private nextElements: NextElement<typeof this.chooseType>[];
  private static nextId = 0;
  private id: number;

  constructor(delay: IDelay, nameOfElement?: string) {
    this.tnext = Infinity;
    this.delayMean = delay.delayMean || 1.0;
    this.distribution = "exp";
    this.tcurr = this.tnext;
    this.state = 0;
    this.nextElements = [];
    this.id = Element.nextId;
    Element.nextId++;
    this.name = nameOfElement || `element_${this.id}`;

    this.delayDev = delay.delayDev || 0;
    this.minDelay = delay.minDelay || 0;
    this.maxDelay = delay.maxDelay || 0;

    console.log(`id=${this.getId()}`);
  }

  public getDelay() {
    let delay = this.getDelayMean();
    switch (this.distribution) {
      case "exp":
        delay = FunRand.exponential(delay);
        break;
      case "uni":
        delay = FunRand.uniform(this.minDelay, this.maxDelay);
        break;
      case "norm":
        delay = FunRand.normal(this.delayMean, this.delayDev);
        break;
      default:
        throw new Error("Wrong distribution type!");
    }

    return delay;
  }

  private validateNextElements(
    nextElements: NextElement<typeof this.chooseType>[]
  ) {
    if (this.chooseType === "priority") {
      const isPriorityAllSet = nextElements.every(
        (el) =>
          isByPriority(el) && el.priority !== undefined && el.priority !== null
      );
      if (!isPriorityAllSet)
        throw new Error(
          "For priority choose type all priorities must be set " + this.name
        );
      return;
    }
    if (this.chooseType === "probability") {
      const isProbabilityAllSet = nextElements.every(
        (el) =>
          isByProb(el) &&
          el.probability !== undefined &&
          el.probability !== null
      );
      if (!isProbabilityAllSet)
        throw new Error(
          "For probability choose type all probabilities must be set " +
            this.name
        );
      const sumprob = nextElements.reduce((prev, curr) => {
        if (isByProb(curr)) {
          return prev + curr.probability;
        }
        return 0; // ts mock
      }, 0);
      if (sumprob !== 1) throw new Error(`Total prob must be 1: ${this.name}`);
      return;
    }
  }

  public setNextElements(nextElements: NextElement<typeof this.chooseType>[]) {
    this.validateNextElements(nextElements);
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

    if (this.chooseType === "priority") {
      return this.chooseByPriority();
    }

    if (this.chooseType === "random") {
      return this.chooseByRandom();
    }
  }

  private chooseByProbability() {
    const rand = Math.random();
    const probs: number[] = [];
    let i = 0;
    for (const el of this.nextElements) {
      if (isByProb(el)) {
        const prob = i === 0 ? el.probability : el.probability + probs[i - 1];
        probs.push(prob);
        i++;
      }
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
        nextEl = this.nextElements[i + 1].element;
        i++;
        break;
      }
    }

    return nextEl;
  }

  private chooseByPriority() {
    const free = this.nextElements.filter((el) => el.element.isFree());
    free.sort((e1, e2) => {
      if (isByPriority(e1) && isByPriority(e2)) {
        return e2.priority - e1.priority;
      }
      return 0; // ts mock
    });

    return free[0]?.element;
  }

  private chooseByRandom() {
    const total = this.nextElements.length;

    const rand = Math.random();
    const step = 1 / total;

    for (let i = 0; i < total; i++) {
      if (rand >= i * step && rand < (i + 1) * step) {
        const foundEvent = this.nextElements[i];
        // if(foundEvent)
        return foundEvent.element;
      }
    }
  }

  public isFree() {}

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
