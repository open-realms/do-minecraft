import Axios from 'axios';
import { MinecraftFlavor } from '../abstract/minecraft-flavor';

export class Vanilla extends MinecraftFlavor {
  static MANIFEST: string =
    'https://launchermeta.mojang.com/mc/game/version_manifest.json';

  constructor(version: string) {
    super(version);
  }

  async getServerUrl(): Promise<string> {
    const manifestResponse = await Axios.get(Vanilla.MANIFEST);
    const versions = manifestResponse.data.versions;
    let url = '';
    versions.forEach((version: { id: string; url: string }) => {
      if (version.id == this.version) {
        url = version.url;
      }
    });

    const versionResponse = await Axios.get(url);
    return versionResponse.data.downloads.server.url;
  }
}
