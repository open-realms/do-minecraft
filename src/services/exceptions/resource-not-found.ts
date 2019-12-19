export class ResourceNotFound extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ResourceNotFound';
    this.stack = (new Error() as any).stack;
  }
}
