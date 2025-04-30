import { GraphQLClient } from 'graphql-request';

export class LeanIXClient {
  constructor(subdomain) {
    if (!subdomain) {
      throw new Error('Subdomain is required');
    }

    this.subdomain = subdomain;
    this.baseUrl = `https://${subdomain}.leanix.net`;
    this.graphqlEndpoint = `${this.baseUrl}/services/pathfinder/v1/graphql`;
    this.tokenEndpoint = `${this.baseUrl}/services/mtm/v1/oauth2/token`;
  }

  async getAccessToken(apiToken) {
    const basicAuth = Buffer.from(`apitoken:${apiToken}`).toString('base64');

    const response = await fetch(this.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  }  

  async query(query, apiToken, variables = {}) {
    const accessToken = await this.getAccessToken(apiToken);

    this.client = new GraphQLClient(this.graphqlEndpoint, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    return await this.client.request(query, variables);
  }
}