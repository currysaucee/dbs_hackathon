// ADD HERE FOR CONSTANTS
const config = {
  API_BASE_URL: 'http://localhost:7070',
  SOCKET_BASE_URL: 'http://localhost:7070',
  ACCESS_TOKEN_REFRESH_INTERVAL: 10000,
  LOGIN_ENDPOINT: 'auth/login',
  REGISTER_ENDPOINT: 'auth/register',
  LOGOUT_ENDPOINT: 'auth/logout',
  REFRESH_ENDPOINT: 'auth/refresh',
  NEW_TRADE_ENDPOINT: 'data/trade',
  MOCK_DATA_ENDPOINT: 'data/get_data',
  COMPANIES: ['Apple', 'Amazon', 'Tesla', 'Google', 'Microsoft'],
}

export default config
