export class InvalidFlavor extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidFlavor';
    this.stack = (new Error() as any).stack;
  }
}
