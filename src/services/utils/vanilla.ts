import Axios from 'axios';

export class Vanilla extends MinecraftFlavor {
  MANIFEST: string =
    'https://launchermeta.mojang.com/mc/game/version_manifest.json';

  constructor(version: string) {
    super(version);
  }

  async getServerUrl(): Promise<string> {
    const response = await Axios.get(this.MANIFEST);
    const versions = response.data.versions;
    let url = '';
    for (let version of versions) {
      if (version.id == this.version) url = version.url;
      break;
    }

    const otherResponse = await Axios.get(url);
    return otherResponse.data.downloads.server.url;
  }
}
