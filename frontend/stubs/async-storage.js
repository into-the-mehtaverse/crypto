/** Stub for @react-native-async-storage/async-storage (used by MetaMask SDK in browser; not needed in web) */
const noop = () => Promise.resolve();
export default {
  getItem: noop,
  setItem: noop,
  removeItem: noop,
  clear: noop,
};
