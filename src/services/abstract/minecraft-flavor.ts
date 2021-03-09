export abstract class MinecraftFlavor {
  protected version: string;

  constructor(version: string) {
    this.version = version;
  }

  public abstract getServerUrl(): Promise<string>;
}
