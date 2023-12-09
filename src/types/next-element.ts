import Element from "../Element";
import Process from "../Process";
import { ChooseNextElementBy } from "./choose-next-el";

export type ElementByProb = {
  element: Element;
  probability: number;
  withBlockingRouting?: boolean;
};
export type ElementByPriority = {
  element: Element;
  priority: number;
  withBlockingRouting?: boolean;
};
export type ElementByRandom = {
  element: Element;
  withBlockingRouting?: boolean;
};
export type ElementByMinQueue = {
  element: Element;
  withBlockingRouting?: boolean;
};
export type NextElement<T extends ChooseNextElementBy> = T extends "probability"
  ? ElementByProb
  : T extends "priority"
  ? ElementByPriority
  : T extends "random"
  ? ElementByRandom
  : T extends "minQueue"
  ? ElementByMinQueue
  : never;

export function isByProb(
  el: ElementByProb | ElementByPriority | ElementByRandom
): el is ElementByProb {
  return (el as ElementByProb).probability !== undefined;
}

export function isByPriority(
  el: ElementByProb | ElementByPriority | ElementByRandom
): el is ElementByPriority {
  return (el as ElementByPriority).priority !== undefined;
}

export function isByRandom(
  el: ElementByProb | ElementByPriority | ElementByRandom
): el is ElementByRandom {
  return (
    (el as ElementByPriority).priority === undefined &&
    (el as ElementByProb).probability === undefined
  );
}

export function isByMinQueue(
  el: ElementByProb | ElementByPriority | ElementByRandom
): el is ElementByRandom {
  return (
    (el as ElementByPriority).priority === undefined &&
    (el as ElementByProb).probability === undefined
  );
}

export function isProcess(
  el: Element | Process
): el is Process {
  return (el as Process).getQueue() !== undefined;
}