// Production Environment Configuration

export const environment = {
  production: true,
  
  // Backend Configuration
  backendType: 'nodejs' as 'nodejs' | 'python',
  
  // API URLs - Update these with your production URLs
  nodeApiUrl: 'https://your-nodejs-api.com/api',
  pythonApiUrl: 'https://your-python-api.com/api',
  
  // Get current API URL based on backend type
  get apiUrl(): string {
    return this.backendType === 'nodejs' ? this.nodeApiUrl : this.pythonApiUrl;
  },
  
  // App Configuration
  appName: 'Notes App',
  appVersion: '1.0.0',
  tokenKey: 'auth_token',
  userKey: 'current_user',
  
  // Feature Flags
  enableLogging: false,
  enableNotifications: true
};
