export default class Queue<T> {
  private tasks: Array<T>;

  constructor() {
    this.tasks = [];
  }

  public queue(task: T) {
    this.tasks.push(task);
  }

  public get(): T {
    return this.tasks.length == 0 ? null : this.tasks.shift();
  }
}
