import axios, { AxiosInstance } from 'axios';

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:3000') {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Intelligence API
  async getIntelligenceData() {
    const response = await this.client.get('/api/intelligence');
    return response.data;
  }

  // DAM API
  async getAssets() {
    const response = await this.client.get('/api/assets');
    return response.data;
  }

  // GEO API
  async getContent() {
    const response = await this.client.get('/api/content');
    return response.data;
  }

  // GEM API
  async getCampaigns() {
    const response = await this.client.get('/api/campaigns');
    return response.data;
  }

  // Sandbox API
  async getSimulations() {
    const response = await this.client.get('/api/simulations');
    return response.data;
  }
}

export default ApiClient;