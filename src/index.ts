import Create from "./Create";
import Dispose from "./Dispose";
import Element from "./Element";
import Model from "./Model";
import Process from "./Process";
import { ClientType } from "./types/client-types";

(async () => {
  const clientTypes = [
    {
      type: ClientType.CHECKED,
      freq: 0.5,
      meanTime: 15,
      priority: 2,
    },
    {
      type: ClientType.SICK_NOT_CHECKED,
      freq: 0.1,
      meanTime: 40,
      priority: 1,
    },
    {
      type: ClientType.TO_BE_CHECKED,
      freq: 0.4,
      meanTime: 30,
      priority: 1,
    },
  ];
  const clientsArrival = new Create(
    {
      delayMean: 15,
    },
    "Clients arrival",
    {
      distribution: "exp",
      chooseType: "random",
      clientTypes,
    }
  );
  const receptionDepartment = new Process(
    {
      delayMean: 12,
    },
    "RECEPTION DEPARTMENT",
    {
      maxWorkers: 2,
      maxQueue: Infinity,
      distribution: "exp",
      chooseType: "clientType",
    }
  );
  const lab = new Process();
  const goToRoom = new Dispose({}, "COME TO ROOM");

  clientsArrival.setNextElements([
    {
      element: receptionDepartment,
    },
  ]);
  receptionDepartment.setNextElements([
    {
      element: goToRoom,
      types: [ClientType.CHECKED],
    },
    {
      element: lab,
      types: [ClientType.SICK_NOT_CHECKED, ClientType.TO_BE_CHECKED],
    },
  ]);
  const arr: Element[] = [];

  const model = new Model(arr);
  model.simulate(1000);
})();
