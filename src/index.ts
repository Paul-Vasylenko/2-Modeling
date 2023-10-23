import Create from "./Create";
import Element from "./Element";
import Model from "./Model";
import Process from "./Process";

(async () => {
  const clientTypes = [
    {
      type: 1,
      freq: 0.5,
      meanTime: 15
    },
    {
      type: 2,
      freq: 0.1,
      meanTime: 40
    },
    {
      type: 3,
      freq: 0.4,
      meanTime: 30
    }
  ]
  const clientsArrival = new Create({
    delayMean: 15
  }, "Clients arrival", {
    distribution: 'exp',
    chooseType: 'random',
    clientTypes
  })

  const arr: Element[] = [];

  const model = new Model(arr);
  model.simulate(1000);
})();
