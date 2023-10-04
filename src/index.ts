import Create from "./Create";
import Element from "./Element";
import Model from "./Model";
import Process from "./Process";

(async () => {
  const create = new Create(1.0, "CREATE", {
    distribution: "exp",
  });
  const MAX_QUEUE = 5;

  const process1 = new Process(1.0, "PROCESSOR1", {
    maxWorkers: 5,
    maxQueue: MAX_QUEUE,
    distribution: "exp",
  });
  const process2 = new Process(1.0, "PROCESSOR2", {
    maxWorkers: 1,
    maxQueue: MAX_QUEUE,
    distribution: "exp",
  });
  const process3 = new Process(1.0, "PROCESSOR3", {
    maxWorkers: 1,
    maxQueue: MAX_QUEUE,
    distribution: "exp",
  });
  const process4 = new Process(1.0, "PROCESSOR4", {
    maxWorkers: 1,
    maxQueue: MAX_QUEUE,
    distribution: "exp",
  });
  const process5 = new Process(1.0, "PROCESSOR5", {
    maxWorkers: 5,
    maxQueue: MAX_QUEUE,
    distribution: "exp",
  });

  create.setNextElements([process1]);
  process1.setNextElements([process2, process3, process4]);
  process2.setNextElements([process5]);
  process3.setNextElements([process5]);
  process4.setNextElements([process5]);

  const arr: Element[] = [
    create,
    process1,
    process2,
    process3,
    process4,
    process5,
  ];

  const model = new Model(arr);
  model.simulate(1000);
})();
