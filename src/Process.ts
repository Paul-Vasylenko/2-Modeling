import Element from "./Element";

// todo 2
// todo 4 --- change only 1 parameter

type Worker = {
    index: number;
    status: 'busy' | 'free',
    tnext: number;
}
class Process extends Element {
    private queue: number;
    private maxqueue: number;
    private failure: number;
    private maxWorkers: number;
    private workers: Worker[] = [];
    private meanQueue: number;

    constructor(delay?: number, nameOfElement?: string, options: {
        maxWorkers: number
    } = { maxWorkers: 1 }) {
        super(delay, nameOfElement);
        this.queue = 0;
        this.failure = 0;
        this.maxqueue = Infinity;
        this.meanQueue = 0.0;
        this.maxWorkers = Infinity;
        this.maxWorkers = options.maxWorkers;
        for (let i = 0; i < this.maxWorkers; i++) {
            this.workers.push({
                index: i,
                status: 'free',
                tnext: Infinity
            })
        }
    }

    public inAct(): void {
        const free = this.getFreeWorker();

        // if is free
        if (free) {
            // set is NOT free
            free.status = 'busy';
            // Delay of work
            free.tnext = super.getTcurr() + super.getDelay()
            // console.log('Made BUSY worker', free.index);

            super.setTnext(free.tnext);
            return
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
        super.setTnext(Math.min(...this.workers.map(w => w.tnext)))
        // set is free
        busyWorker.status = 'free'

        // if queue is not empty
        if (this.getQueue() > 0) {
            // get out of queue
            this.setQueue(this.getQueue() - 1);
            // set busy again (we take next element)
            busyWorker.status = 'busy'
            // delay for that element
            busyWorker.tnext = super.getTcurr() + super.getDelay();
            super.setTnext(Math.min(...this.workers.map(w => w.tnext)))
        }

        // process next element
        super.getNextElement()?.inAct()
    }

    public getQueue() {
        return this.queue;
    }

    public getState(): number {
        return this.getBusyWorker()?.index || 0;
    }

    public getFreeWorker() {
        return this.workers.find(w => w.status === 'free');
    }

    public getBusyWorker() {
        const busyWorkers = this.workers.filter(w => w.status === 'busy');
        const minTNext = Math.min(...busyWorkers.map(w => w.tnext));
        return this.workers.find(w => w.tnext === minTNext);
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
        this.meanQueue = this.getMeanQueue() + this.queue * delta
    }

    public getMaxWorkers() {
        return this.maxWorkers;
    }

    public getWorkers() {
        return this.workers
    }
}

export default Process;