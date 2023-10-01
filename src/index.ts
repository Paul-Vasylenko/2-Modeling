import Create from "./Create"
import Element from "./Element";
import Model from "./Model";
import Process from "./Process";

(async () => {
    const create = new Create(1.0);
    const process1 = new Process(1.0, undefined, {
        maxWorkers: 1
    });
    const process2 = new Process(2.0, undefined, {
        maxWorkers: 5
    });
    const process3 = new Process(3.0, undefined, {
        maxWorkers: 1
    });
    
    console.log(`id0=${create.getId()}`);
    console.log(`id1=${process1.getId()}`);
    console.log(`id2=${process2.getId()}`);
    console.log(`id3=${process3.getId()}`);


    create.setNextElement(process1);
    process1.setNextElement(process2);
    process2.setNextElement(process3);

    const MAX_QUEUE = 5;

    process1.setMaxQueue(MAX_QUEUE);
    process2.setMaxQueue(MAX_QUEUE);
    process3.setMaxQueue(MAX_QUEUE);

    create.setName('CREATOR');
    process1.setName('PROCESSOR1');
    process2.setName('PROCESSOR2');
    process3.setName('PROCESSOR3');
    
    create.setDistribution('exp');
    process1.setDistribution('exp');
    process2.setDistribution('exp');
    process3.setDistribution('exp');

    const arr: Element[] = [create, process1, process2, process3];
    // const arr: Element[] = [create, process1];

    const model = new Model(arr);
    model.simulate(1000);
})()