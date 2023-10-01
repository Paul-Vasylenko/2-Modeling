import FunRand from "./FunRand";

type DistributionType = 'exp'
class Element {
    private name: string;
    private tnext: number;
    private delayMean: number;
    // private delayDev: number; // Needed in other distributions
    private distribution: DistributionType;
    private quantity: number = 0;
    private tcurr: number;
    private state: number;
    private nextElement: Element | null;
    private static nextId = 0;
    private id: number;

    constructor(delay?: number, nameOfElement?: string) {
        this.tnext = Infinity;
        this.delayMean = delay || 1.0;
        this.distribution = "exp";
        this.tcurr = this.tnext;
        this.state = 0;
        this.nextElement = null;
        this.id = Element.nextId;
        Element.nextId++;
        this.name = nameOfElement || `element_${this.id}`;
    }

    public getDelay() {
        let delay = this.getDelayMean();
        switch(this.distribution){
            case 'exp':
                delay = FunRand.exponential(delay);
                break;
            default:
                throw new Error('Wrong distribution type!')
        }

        return delay;
    }

    public setNextElement(nextElement: Element) {
        this.nextElement = nextElement;
    }

    public getNextElement() {
        return this.nextElement;
    }

    // public getDelayDev() {
    //     return this.delayDev
    // }
    //
    // public setDelayDev(delayDev: number) {
    //     this.delayDev = delayDev
    // }

    public getDistribution(): DistributionType {
        return this.distribution
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

    public inAct() {

    }

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
        console.log(`${this.getName()} | state=${this.state} | quantity=${this.quantity} | tnext=${this.tnext}`);
    }

    public doStatistics(delta?: number) {

    }
}

export default Element;