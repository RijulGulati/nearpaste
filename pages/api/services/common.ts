import {
  Near,
  ConnectConfig,
  connect,
  Account,
  KeyPair,
  keyStores,
} from 'near-api-js';
import { AccountBalance } from 'near-api-js/lib/account';
import {
  getEnvironmentVariable,
  getNodeInfoFromNetworkId,
} from '../../../utils/common';
import { PasteNearRequest, PasteNearResponse } from '../../../utils/interfaces';

const ACCOUNT_ID = getEnvironmentVariable('NEAR_ACCOUNT_ID');
const PRIVATE_KEY = getEnvironmentVariable('NEAR_ACCOUNT_PRIVATE_KEY');
const NETWORK_ID = getEnvironmentVariable('NEAR_NETWORK_ID');
const keyStore = new keyStores.InMemoryKeyStore();

const createPaste = async (paste: PasteNearRequest) => {
  try {
    const account = await getAccount();
    const result = await account.functionCall({
      contractId: ACCOUNT_ID,
      methodName: 'new_paste',
      args: paste,
    });

    return result;
  } catch (err: any) {
    throw new Error(
      err && err.message
        ? err.message
        : 'An error occured while creating paste. Please try again later!'
    );
  }
};

const getPaste = async (id: string): Promise<PasteNearResponse | null> => {
  try {
    const account = await getAccount();
    const paste = await account.viewFunction(ACCOUNT_ID, 'get_paste', {
      id: id,
    });
    if (paste) {
      let result = paste as PasteNearResponse;
      return result;
    }

    return null;
  } catch (err: any) {
    throw new Error(
      err && err.message
        ? err.message
        : 'An error occured while fetching paste. Please try again later!'
    );
  }
};

const nearConnect = async (): Promise<Near> => {
  let node = getNodeInfoFromNetworkId(NETWORK_ID);
  await setupKeystore();
  const config: ConnectConfig = {
    networkId: NETWORK_ID,
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

const getTotalPasteCount = async (): Promise<number> => {
  try {
    const account = await getAccount();
    const count = await account.viewFunction(
      ACCOUNT_ID,
      'get_total_pastes',
      {}
    );
    return count;
  } catch (err: any) {
    throw new Error(err);
  }
};

const getAccountBalance = async (): Promise<AccountBalance> => {
  const account = await getAccount();
  const balance = await account.getAccountBalance();
  return balance;
};

export {
  getAccount,
  createPaste,
  getPaste,
  getTotalPasteCount,
  getAccountBalance,
};
