// ADD HERE FOR CONSTANTS
const config = {
  API_BASE_URL: "http://localhost:8080",
  SOCKET_BASE_URL: "http://localhost:8080",
  ACCESS_TOKEN_REFRESH_INTERVAL: 10000,
  LOGIN_ENDPOINT: "auth/login",
  REGISTER_ENDPOINT: "auth/register",
  LOGOUT_ENDPOINT: "auth/logout",
  REFRESH_ENDPOINT: "auth/refresh",
  NEW_TRADE_ENDPOINT: "data/trade",
  MOCK_DATA_ENDPOINT: "data/get_data",
  COMPANIES: ['Apple', 'Amazon', 'Tesla', 'Google', 'Microsoft'],
  MOCK_ACCOUNT_BALANCE: 1000000
};
  
  export default config;

