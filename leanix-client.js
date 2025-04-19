import { GraphQLClient } from 'graphql-request';

export class LeanIXClient {
  constructor(subdomain, apiToken) {
    if (!subdomain || !apiToken) {
      throw new Error('Both subdomain and apiToken are required');
    }

    this.subdomain = subdomain;
    this.baseUrl = `https://${subdomain}.leanix.net`;
    this.graphqlEndpoint = `${this.baseUrl}/services/pathfinder/v1/graphql`;
    this.tokenEndpoint = `${this.baseUrl}/services/mtm/v1/oauth2/token`;
    this.apiToken = apiToken;
  }

  async getAccessToken() {
    const basicAuth = Buffer.from(`apitoken:${this.apiToken}`).toString('base64');
    
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

  async query(query, variables = {}) {
    const accessToken = await this.getAccessToken();
    this.client = new GraphQLClient(this.graphqlEndpoint, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    return await this.client.request(query, variables);
  }
}