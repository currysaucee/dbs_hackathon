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
  AMEND_ORDER_ENDPOINT: "data/update_order",
  DELETE_ORDER_ENDPOINT: "data/delete_order",
  MOCK_DATA_ENDPOINT: "data/get_data",
  ACCEPT_ORDER_ENDPOINT: "trade/reject",
  REJECT_ORDER_ENDPOINT: "trade/accept",
  GET_MY_TRADES_ENDPOINT: "data/get_orders_by_account_id",
  COMPANIES: ['Apple', 'Amazon', 'Tesla', 'Google', 'Microsoft'],
  MOCK_ACCOUNT_BALANCE: 1000000,
  MOCK_CARBON_CREDIT: 1000,
  MOCK_ACCOUNT_NAME: "Aloysius's Company"
};
  
  export default config;

