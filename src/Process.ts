import Element from "./Element";
import { ChooseNextElementBy } from "./types/choose-next-el";
import { IDelay } from "./types/delay";
import { DistributionType } from "./types/distribution";

// todo 2
// todo 4 --- change only 1 parameter

type Worker = {
  index: number;
  status: "busy" | "free";
  tnext: number;
};
class Process extends Element {
  private queue: number;
  private maxqueue: number;
  private failure: number;
  private maxWorkers: number;
  private workers: Worker[] = [];
  private meanQueue: number;
  private totalWorkTime = 0;
  private swapQueueCounter = 0;
  private changeQueueDiff = 0;
  private neightbours: Process[] = [];

  constructor(
    delay: IDelay,
    nameOfElement?: string,
    options: {
      maxWorkers: number;
      maxQueue: number;
      distribution: DistributionType;
      chooseType: ChooseNextElementBy;
    } = {
      maxWorkers: 1,
      maxQueue: Infinity,
      distribution: "exp",
      chooseType: "priority",
    }
  ) {
    super(delay, nameOfElement);
    this.queue = 0;
    this.chooseType = options.chooseType;
    this.failure = 0;
    this.maxqueue = options.maxQueue;
    this.meanQueue = 0.0;
    this.maxWorkers = options.maxWorkers;
    this.setDistribution(options.distribution);
    for (let i = 0; i < this.maxWorkers; i++) {
      this.workers.push({
        index: i,
        status: "free",
        tnext: Infinity,
      });
    }
  }

  public inAct(): void {
    const free = this.getFreeWorker();
    
    // if is free
    if (free) {
      // set is NOT free
      free.status = "busy";
      // Delay of work
      const delay = super.getDelay();
      
      free.tnext = super.getTcurr() + delay;

      this.setTotalWorkTime(this.getTotalWorkTime() + delay);

      super.setTnext(free.tnext);
      return;
    }
    // if is not free
    // if queue is not full
    if (this.getQueue() < this.getMaxQueue()) {
      // add to queue
      this.setQueue(this.getQueue() + 1);
    } else {
      // failure
      this.failure++;
    }
  }

  public outAct(): void {
    super.outAct();
    
    const busyWorker = this.getBusyWorker();

    if (!busyWorker) {
      throw new Error();
    }

    // set that is finished
    busyWorker.tnext = Infinity;
    super.setTnext(Math.min(...this.workers.map((w) => w.tnext)));
    // set is free
    busyWorker.status = "free";

    this.tryChangeQueue();

    // process next element
    const element = super.getNextElement();
    if (element && !element.isFree()) {
      // chosen elemetnt in list of `nestElements`
      const nextElement = this.getNextElements().find(
        (el) => el.element.getId() === element.getId()
      );
      // блокування маршруту
      if (nextElement?.withBlockingRouting) {
        busyWorker.tnext = element.getTnext();
        busyWorker.status = "busy";
        return;
      }
    }
    // if queue is not empty
    if (busyWorker.status === "free" && this.getQueue() > 0) {
      // get out of queue
      this.setQueue(this.getQueue() - 1);
      // set busy again (we take next element)
      busyWorker.status = "busy";
      // delay for that element
      const delay = super.getDelay();
      busyWorker.tnext = super.getTcurr() + delay;
      this.setTotalWorkTime(this.getTotalWorkTime() + delay);

      super.setTnext(Math.min(...this.workers.map((w) => w.tnext)));
    }
    element?.inAct();
  }

  public getQueue(): number {
    return this.queue;
  }

  public tryChangeQueue() {
    for (const neightbour of this.neightbours) {
      const queueDiff = this.queue - neightbour.queue;
      if (queueDiff >= this.changeQueueDiff) {
        neightbour.queue++;
        this.queue--;
        this.swapQueueCounter++;
        
        return;
      }
    }
  }

  public getState(): number {
    return this.getBusyWorker()?.index || 0;
  }

  public getFreeWorker() {
    return this.workers.find((w) => w.status === "free");
  }

  public getBusyWorker() {
    const busyWorkers = this.workers.filter((w) => w.status === "busy");
    const minTNext = Math.min(...busyWorkers.map((w) => w.tnext));
    return this.workers.find((w) => w.tnext === minTNext);
  }

  public setQueue(queue: number) {
    this.queue = queue;
  }

  public getFailure() {
    return this.failure;
  }

  public getMaxQueue() {
    return this.maxqueue;
  }

  public setMaxQueue(max: number) {
    this.maxqueue = max;
  }

  public getMeanQueue() {
    return this.meanQueue;
  }

  public doStatistics(delta: number): void {
    this.meanQueue = this.getMeanQueue() + this.queue * delta;
  }

  public getMaxWorkers() {
    return this.maxWorkers;
  }

  public getWorkers() {
    return this.workers;
  }

  public getTotalWorkTime() {
    return this.totalWorkTime;
  }

  public setTotalWorkTime(time: number) {
    this.totalWorkTime = time;
  }

  public getNeighours() {
    return this.neightbours;
  }

  public setNeighours(neightbours: Process[], changeQueueDiff: number) {
    this.neightbours = neightbours;
    this.changeQueueDiff = changeQueueDiff;
  }

  public setWorkers(workers: Worker[]){
    this.workers = workers;
  }

  public isFree() {
    return (
      // в цьому випадку вільною каса вважається без врахування черги
      this.workers.some((w) => w.status === "free")
      // ||
      // this.queue < this.maxqueue
    );
  }
}

export default Process;
