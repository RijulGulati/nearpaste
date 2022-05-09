import {
  connect,
  ConnectConfig,
  Contract,
  KeyPair,
  keyStores,
  Near,
} from 'near-api-js';
import { Account, AccountBalance } from 'near-api-js/lib/account';
import { Paste } from './common';

interface NodeInfo {
  nodeUrl: string;
}

interface NearPaste {
  id: string;
  title: string;
  content: string;
  is_encrypted: boolean;
  timestamp: number;
}

const keyStore = new keyStores.InMemoryKeyStore();
const PRIVATE_KEY =
  '4vnawrnf81vGvjPAyJySJjxDCd9JaFgXYaAEUiQaJumuRnjF8XoaPKYGiKH82gPo6ouzyNHams5GTRNrzuKqPw3r'; // TODO: get from env file

const ACCOUNT_ID = 'paste.rijul.testnet';
const NETWORK_ID = 'testnet';

const getAccountBalance = async (): Promise<AccountBalance> => {
  const account = await getAccount();
  const balance = await account.getAccountBalance();
  return balance;
};

const createPaste = async (
  id: string,
  title: string,
  content: string,
  isEncrypted: boolean
) => {
  debugger;
  const np: NearPaste = {
    id,
    title,
    content,
    is_encrypted: isEncrypted,
    timestamp: 0,
  };

  const account = await getAccount();

  const result = await account.functionCall({
    contractId: ACCOUNT_ID,
    methodName: 'new_paste',
    args: np,
  });

  return result;
};

const nearConnect = async (): Promise<Near> => {
  let node = getNodeInfoFromNetworkId(NETWORK_ID);
  await setupKeystore();
  const config: ConnectConfig = {
    networkId: NETWORK_ID, // FROM env file
    nodeUrl: node.nodeUrl,
    keyStore: keyStore,
    headers: {},
  };

  const near = await connect(config);
  return near;
};

const getAccount = async (): Promise<Account> => {
  const near = await nearConnect();
  const account = await near.account(ACCOUNT_ID);
  return account;
};

const setupKeystore = async () => {
  let kp = await keyStore.getKey(NETWORK_ID, ACCOUNT_ID);
  if (!kp) {
    const keypair = KeyPair.fromString(PRIVATE_KEY);
    await keyStore.setKey(NETWORK_ID, ACCOUNT_ID, keypair);
  }
};

const getNodeInfoFromNetworkId = (networkId: string): NodeInfo => {
  let node: NodeInfo = {} as any;
  switch (networkId.toLowerCase()) {
    case 'testnet': {
      node.nodeUrl = 'https://rpc.testnet.near.org';
      return node;
    }
    default:
      throw new Error('Invalid NETWORK_ID');
  }
};

export { ACCOUNT_ID, getAccountBalance, createPaste };
