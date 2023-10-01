import Element from "./Element";
import Process from "./Process";

class Model {
    private list: Element[];
    private tnext: number;
    private tcurr: number;
    private event: number;

    constructor(list: Element[]) {
        this.list = list;
        this.tnext = 0;
        this.event = 0;
        this.tcurr = this.tnext;
    }

    public simulate(time: number) {
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
        let totalMean = 0;
        let totalFailures = 0;
        let total = 0;
        for (const el of this.list) {
            el.printResult();

            if (el instanceof Process) {
                const mean = el.getMeanQueue() / this.tcurr;
                totalMean += mean;
                total++;
                totalFailures += el.getFailure();
                console.log(`Mean length of queue=${mean} | failure=${el.getFailure()} |failure probability=${el.getFailure() / el.getQuantity()}`);
            }

        }
        console.log(`Mean load of system=${totalMean / total}`);
        console.log(`Total failures=${totalFailures}`);
    }
}

export default Model;