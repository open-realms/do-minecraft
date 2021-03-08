import Axios from 'axios';

const MANIFEST = "https://launchermeta.mojang.com/mc/game/version_manifest.json"

export async function getServerUrl(version: string): Promise<string> {
  const response = await Axios.get(MANIFEST);
  const versions = response.data.versions;
  let url = ""
  for(let version of versions) {
    if (version.id == version)
      url = version.url;
      break;
  }

  const otherResponse = await Axios.get(url);
  return otherResponse.data.downloads.server.url;
}
