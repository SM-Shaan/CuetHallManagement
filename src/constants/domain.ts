// Domain constant for the entire project
export const DOMAIN = 'https://localhost:7057';

// Alternative approach with more configuration options
export const API_CONFIG = {
  DOMAIN: 'https://localhost:7057',
  PORT: '7057',
  PROTOCOL: 'https',
  HOST: 'localhost',
  
  // Helper method to get full URL
  getBaseUrl: () => `${API_CONFIG.PROTOCOL}://${API_CONFIG.HOST}:${API_CONFIG.PORT}`,
  
  // Helper method to build endpoint URLs
  buildUrl: (endpoint: string) => {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_CONFIG.DOMAIN}${cleanEndpoint}`;
  }
};

// Export for easy import
export default DOMAIN;
