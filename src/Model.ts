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

            console.log(`\nIt's time for event in ${this.list[this.event].getName()}, time=${this.tnext}`);

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
        for (const el of this.list) {
            el.printResult();

            if (el instanceof Process) {
                const mean = el.getMeanQueue() / this.tcurr;
                totalFailures += el.getFailure();
                console.log(`Mean length of queue=${mean} | failure=${el.getFailure()} |failure probability=${el.getFailure() / ( el.getQuantity() + el.getFailure() )} | Mean work time ${el.getTotalWorkTime() / this.time} | Average worker work time ${el.getTotalWorkTime() / this.time / el.getWorkers().length}`);
            }

        }
        console.log(`Total failures=${totalFailures}`);
    }
}

export default Model;