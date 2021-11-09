const GenericClient = require('./GenericClient');
const axios = require('axios').default;
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');

axiosCookieJarSupport(axios);

class StandaloneClient extends GenericClient {
  constructor(username, password) {
    super();

    this._username = username;
    this._password =password;
  }

  async init(region = 'eu') {
    this._region = region;
    await this._buildHeaders();
  }

  async _getValorantClientVersion() {
    return (await axios.get('https://valorant-api.com/v1/version')).data.data.riotClientVersion;
  }

  async _buildHeaders() {
    const cookieJar = new tough.CookieJar();

    let data = {
      'client_id': 'play-valorant-web-prod',
      'nonce': '1',
      'redirect_uri': 'https://playvalorant.com/opt_in',
      'response_type': 'token id_token',
    };

    let response = await axios.post('https://auth.riotgames.com/api/v1/authorization', data, {
      jar: cookieJar,
      withCredentials: true
    });

    data = {
      'type': 'auth',
      'username': this._username,
      'password': this._password
    };

    response = await axios.put('https://auth.riotgames.com/api/v1/authorization', data, {
      jar: cookieJar,
      withCredentials: true
    });

    let uri = response.data.response.parameters.uri;
    let strTokens = uri.replace('https://playvalorant.com/opt_in#', '').split('&');

    let arrayTokens = {};

    strTokens.forEach(token => {
      arrayTokens[token.split('=')[0]] = token.split('=')[1];
    });

    var accessToken = arrayTokens.access_token;

    let headers = {
      'Authorization': `Bearer ${arrayTokens.access_token}`
    };

    response = await axios.post('https://entitlements.auth.riotgames.com/api/token/v1', {}, {
      jar: cookieJar,
      withCredentials: true,
      headers
    });

    var entitlementsToken = response.data.entitlements_token;

    response = await axios.post('https://auth.riotgames.com/userinfo', {}, {
      jar: cookieJar,
      withCredentials: true,
      headers
    });

    this.puuid = response.data.sub;

    this.remoteHeaders = {
      'Authorization': 'Bearer ' + accessToken,
      'X-Riot-Entitlements-JWT': entitlementsToken,
      'X-Riot-ClientPlatform': 'ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9',
      'X-Riot-ClientVersion': await this._getValorantClientVersion()
    };
  }
}

module.exports = StandaloneClient;