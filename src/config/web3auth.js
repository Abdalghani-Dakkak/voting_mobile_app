import Constants from 'expo-constants';
import { WEB3AUTH_NETWORK } from '@web3auth/react-native-sdk';

const extra = Constants.expoConfig?.extra || {};

export const WEB3AUTH_CLIENT_ID = extra.web3authClientId;
export const SEPOLIA_RPC_URL = extra.sepoliaRpcUrl;
export const CONTRACT_ADDRESS = extra.contractAddress || '0xfa746708C5A286BEaC5249198E87B7De4f8b4fcE';

// Must also be added to "Allowed Origins" on the Web3Auth/MetaMask Embedded Wallets
// dashboard project that owns WEB3AUTH_CLIENT_ID, or login will fail to complete.
export const WEB3AUTH_REDIRECT_URL = 'quickvoting://auth';

export const web3AuthConfig = {
  web3AuthOptions: {
    clientId: WEB3AUTH_CLIENT_ID,
    network: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    redirectUrl: WEB3AUTH_REDIRECT_URL,
    chains: [
      {
        chainNamespace: 'eip155',
        chainId: '0xaa36a7',
        rpcTarget: SEPOLIA_RPC_URL,
        displayName: 'Ethereum Sepolia Testnet',
        blockExplorerUrl: 'https://sepolia.etherscan.io',
        ticker: 'ETH',
        tickerName: 'Ethereum',
        logo: 'https://images.web3auth.io/eth.svg',
      },
    ],
    defaultChainId: '0xaa36a7',
  },
};
