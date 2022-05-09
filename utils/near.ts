import { connect, ConnectConfig, KeyPair, keyStores, Near } from "near-api-js";
import { Account, AccountBalance } from "near-api-js/lib/account";
import { FinalExecutionStatus } from "near-api-js/lib/providers";
import { FinalExecutionStatusBasic } from "near-api-js/lib/providers/provider";
import { PasteUx } from "./common";

interface NodeInfo {
  nodeUrl: string;
  explorerUrl: string;
}

interface NearPaste {
  id: string;
  title: string;
  content: string;
  is_encrypted: boolean;
  timestamp: number;
}

const keyStore = new keyStores.InMemoryKeyStore();
const PRIVATE_KEY = process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY : "";

const ACCOUNT_ID = process.env.NEXT_PUBLIC_ACCOUNT_ID
  ? process.env.NEXT_PUBLIC_ACCOUNT_ID
  : "";
const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID
  ? process.env.NEXT_PUBLIC_NETWORK_ID
  : "";

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
  try {
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
      methodName: "new_paste",
      args: np,
    });

    return result;
  } catch (err: any) {
    throw new Error(
      err && err.message
        ? err.message
        : "An error occured while creating paste. Please try again later!"
    );
  }
};

const getPaste = async (id: string): Promise<PasteUx | null> => {
  try {
    debugger;
    const account = await getAccount();
    const result = await account.functionCall({
      contractId: ACCOUNT_ID,
      methodName: "get_paste",
      args: { id: id },
    });

    debugger;

    if (result) {
      let base64str = (result.status as FinalExecutionStatus).SuccessValue
        ? (result.status as FinalExecutionStatus).SuccessValue
        : "";

      if (base64str) {
        let objString = Buffer.from(base64str, "base64").toString("utf-8");
        let np: NearPaste | null = JSON.parse(objString);
        if (np) {
          const pasteUx: PasteUx = {
            content: np.content,
            id: np.id,
            isEncrypted: np.is_encrypted,
            title: np.title,
            timestamp: np.timestamp,
          };
          return pasteUx;
        }
      }
      return null;
    }

    return null;
  } catch (err: any) {
    debugger;
    throw new Error(
      err && err.message
        ? err.message
        : "An error occured while fetching paste. Please try again later!"
    );
  }
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
    case "testnet": {
      node.nodeUrl = "https://rpc.testnet.near.org";
      node.explorerUrl = "https://explorer.testnet.near.org";
      return node;
    }
    default:
      throw new Error("Invalid NETWORK_ID");
  }
};

const getTxnSuccessValue = (
  status: FinalExecutionStatus | FinalExecutionStatusBasic
) => {
  let st = status as FinalExecutionStatus;
  let result = st.SuccessValue
    ? Buffer.from(st.SuccessValue, "base64").toString("utf-8")
    : "";
  return result;
};

export {
  ACCOUNT_ID,
  NETWORK_ID,
  getAccountBalance,
  createPaste,
  getPaste,
  getTxnSuccessValue,
};
