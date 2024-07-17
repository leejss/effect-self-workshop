// Role of pipe function is to compose functions in a way that the output of one function is the input of the next function.

export function pipe2<A, B>(a: A, ab: (a: A) => B) {
  return ab(a);
}

export function pipe3<A, B, C>(a: A, ab: (a: A) => B, bc: (b: B) => C) {
  return bc(ab(a));
}

// Simulating Effect pipeline

class Service {}
class Effect {
  _service: Service | undefined;
  constructor(service?: Service) {
    this._service = service;
  }
  static make() {
    return new Effect();
  }

  static provide(service: Service) {
    return (self: Effect) => {
      return self._provide(service);
    };
  }

  _provide(service: Service) {
    this._service = service;
    return this;
  }
}

const e = pipe2(Effect.make(), Effect.provide(new Service()));
