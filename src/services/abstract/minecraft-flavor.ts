export abstract class MinecraftFlavor {
  version: string;

  constructor(version: string) {
    this.version = version;
  }

  abstract getServerUrl(): Promise<string>;
}
