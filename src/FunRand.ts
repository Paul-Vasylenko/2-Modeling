import random from "random-normal";

class FunRand {
  static exponential(timeMean: number): number {
    let a = 0;
    while (a === 0) {
      a = Math.random();
    }

    a = -timeMean * Math.log(a);

    return a;
  }

  // рівномірне
  static uniform(timeMin: number, timeMax: number): number {
    let a = 0;
    while (a === 0) {
      a = Math.random();
    }
    a = timeMin + a * (timeMax - timeMin);

    return a;
  }

  static normal(timeMean: number, timeDeviation: number): number {
    return random({
      mean: timeMean,
      dev: timeDeviation,
    });
  }
}

export default FunRand;
