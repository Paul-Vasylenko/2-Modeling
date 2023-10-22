import Create from "./Create";
import Element from "./Element";
import Model from "./Model";
import Process from "./Process";

(async () => {
  const clientsArrival = new Create(
    {
      delayMean: 0.1,
    },
    "CLIENTS ARRIVAL",
    {
      distribution: "const",
      chooseType: "minQueue",
    }
  );
  clientsArrival.outAct()
  clientsArrival.setDistribution('exp');
  clientsArrival.setDelayMean(0.5)

  const cashier1 = new Process(
    {
      delayMean: 1,
      delayDev: 0.3
    },
    "CASHIER 1",
    {
      distribution: "norm",
      chooseType: "random",
      maxQueue: 3,
      maxWorkers: 1,
    }
  );
  cashier1.setQueue(2);
  cashier1.inAct();
  cashier1.setDistribution('exp')
  cashier1.setDelayMean(0.3)
  cashier1.setDelayDev(0)

  const cashier2 = new Process(
    {
      delayMean: 1,
      delayDev: 0.3,
    },
    "CASHIER 2",
    {
      distribution: "norm",
      chooseType: "random",
      maxQueue: 3,
      maxWorkers: 1,
    }
  );
  cashier2.setQueue(2);
  cashier2.inAct();
  cashier2.setDistribution('exp')
  cashier2.setDelayMean(0.3)
  cashier2.setDelayDev(0)

  cashier1.setNeighours([cashier2], 2);
  cashier2.setNeighours([cashier1], 2);

  clientsArrival.setNextElements([
    {
      element: cashier1,
    },
    {
      element: cashier2,
    },
  ]);

  const arr: Element[] = [clientsArrival, cashier1, cashier2];

  const model = new Model(arr);
  model.simulate(1000);
})();
