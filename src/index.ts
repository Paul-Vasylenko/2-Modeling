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
      chooseType: "priority",
    }
  );
  const MAX_QUEUE = 5;

  const process1 = new Process(
    {
      delayMean: 1,
      delayDev: 1,
      minDelay: 1,
      maxDelay: 2
    },
    "PROCESSOR1",
    {
      maxWorkers: 5,
      maxQueue: MAX_QUEUE,
      distribution: "uni",
      chooseType: "probability",
    }
  );
  const process2 = new Process(
    {
      delayMean: 1,
    },
    "PROCESSOR2",
    {
      maxWorkers: 1,
      maxQueue: MAX_QUEUE,
      distribution: "exp",
      chooseType: "priority",
    }
  );
  const process3 = new Process(
    {
      delayMean: 1,
    },
    "PROCESSOR3",
    {
      maxWorkers: 1,
      maxQueue: MAX_QUEUE,
      distribution: "exp",
      chooseType: "priority",
    }
  );
  const process4 = new Process(
    {
      delayMean: 1,
    },
    "PROCESSOR4",
    {
      maxWorkers: 1,
      maxQueue: MAX_QUEUE,
      distribution: "exp",
      chooseType: "priority",
    }
  );
  const process5 = new Process(
    {
      delayMean: 1,
    },
    "PROCESSOR5",
    {
      maxWorkers: 5,
      maxQueue: MAX_QUEUE,
      distribution: "exp",
      chooseType: "priority",
    }
  );

  create.setNextElements([
    {
      element: process1,
      probability: 1,
      priority: 1,
    },
  ]);
  process1.setNextElements([
    {
      element: process2,
      priority: 1,
      probability: 0.5,
    },
    {
      element: process3,
      priority: 5,
      probability: 0.5,
    },
    {
      element: process4,
      priority: 3,
      probability: 0,
    },
  ]);
  process2.setNextElements([
    {
      element: process5,
      priority: 1,
      probability: 1,
    },
  ]);
  process3.setNextElements([
    {
      element: process5,
      priority: 1,
      probability: 1,
    },
  ]);
  process4.setNextElements([
    {
      element: process5,
      priority: 1,
      probability: 1,
    },
  ]);

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
