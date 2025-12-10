// Development Environment Configuration
// Switch between 'nodejs' and 'python' backends

export const environment = {
  production: false,
  
  // Backend Configuration
  // Change this to 'python' to use Python/FastAPI backend
  // Change this to 'nodejs' to use Node.js/Express backend
  backendType: 'nodejs' as 'nodejs' | 'python',
  
  // API URLs
  nodeApiUrl: 'http://localhost:3000/api',
  pythonApiUrl: 'http://localhost:8000/api',
  
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
  enableLogging: true,
  enableNotifications: true
};
