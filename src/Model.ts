import Element from "./Element";
import Process from "./Process";

class Model {
  private list: Element[];
  private tnext: number;
  private tcurr: number;
  private event: number;
  private time: number;

  constructor(list: Element[]) {
    this.list = list;
    this.tnext = 0;
    this.event = 0;
    this.time = 0;
    this.tcurr = this.tnext;
  }

  public simulate(time: number) {
    this.time = time;
    while (this.tcurr < time) {
      this.tnext = Infinity;
      for (const el of this.list) {
        if (el.getTnext() < this.tnext) {
          this.tnext = el.getTnext();
          this.event = el.getId();
        }
      }

      console.log(
        `\nIt's time for event in ${this.list[this.event].getName()}, time=${
          this.tnext
        }`
      );

      for (const el of this.list) {
        el.doStatistics(this.tnext - this.tcurr);
      }
      this.tcurr = this.tnext;
      for (const el of this.list) {
        el.setTcurr(this.tcurr);
      }
      this.list[this.event].outAct();
      for (const el of this.list) {
        if (el.getTnext() === this.tcurr) {
          el.outAct();
        }
      }
      this.printInfo();
    }
    this.printResults();
  }

  printInfo() {
    for (const el of this.list) {
      el.printInfo();
    }
  }

  printResults() {
    console.log("\n-------------RESULTS---------------");
    let totalFailures = 0;
    let totalQuantity = 0;
    let totalSwap = 0;
    let totalLeaveIntervals = 0;
    let totalClientTime = 0;
    for (const el of this.list) {
      el.printResult();

      if (el instanceof Process) {
        const mean = el.getMeanQueue() / this.tcurr;
        totalFailures += el.getFailure();
        console.log(`(5)Mean length of queue=${mean}`);
        const quantity = el.getQuantity() + el.getFailure();
        totalQuantity += quantity;
        totalSwap += el.swapQueueCounter;
        totalLeaveIntervals += el.leaveIntervals;
        totalClientTime += el.totalClientTime;
        console.log(
          `(1)Mean work time ${
            el.getTotalWorkTime() / this.time
          }`
        );
      }
    }
    console.log('==========');
    console.log(
      `(2)Mean clients in bank=${totalQuantity / this.time}`
    );
    console.log(
      `(3)Mean leave intervals=${totalLeaveIntervals / totalQuantity}`
    );
    console.log(
      `(4)Mean client time=${totalClientTime / totalQuantity}`
    );
    console.log(
      `(6)Total failures=${totalFailures}|Failure probability=${
        totalFailures / totalQuantity
      }`
    );
    console.log(`(7)Total swaps=${totalSwap}`);
    
  }
}

export default Model;
