import Create from "./Create";
import Element from "./Element";
import Model from "./Model";
import Process from "./Process";

(async () => {
  const create = new Create(
    {
      delayMean: 1,
    },
    "CREATE",
    {
      distribution: "exp",
      chooseType: "random",
    }
  );

  const process1 = new Process(
    {
      delayMean: 1,
    },
    "PROCESS1",
    {
      maxQueue: 0,
      maxWorkers: 1,
      distribution: "exp",
      chooseType: "random",
    }
  );

  const process2 = new Process(
    {
      delayMean: 2,
    },
    "PROCESS2",
    {
      maxQueue: Infinity,
      maxWorkers: 2,
      distribution: "exp",
      chooseType: "probability",
    }
  );

  const process3 = new Process(
    {
      delayMean: 2,
    },
    "PROCESS3",
    {
      maxQueue: 5,
      maxWorkers: 1,
      distribution: "exp",
      chooseType: "random",
    }
  );

  create.setNextElements([
    {
      element: process1,
    },
  ]);
  process1.setNextElements([
    {
      element: process2,
    },
  ]);
  process2.setNextElements([
    {
      element: process3,
      probability: 1,
      withBlockingRouting: true
    },
  ]);

  const arr: Element[] = [create, process1, process2, process3];

  const model = new Model(arr);
  model.simulate(1000);
})();
