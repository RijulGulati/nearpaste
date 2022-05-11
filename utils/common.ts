import { AES, enc, format } from 'crypto-js';
import {
  FinalExecutionStatus,
  FinalExecutionStatusBasic,
} from 'near-api-js/lib/providers';
import { HttpPasteGetResponse, HttpResponse, PasteUx } from './interfaces';

interface NodeInfo {
  nodeUrl: string;
  explorerUrl: string;
}

const decrypt = (ciphertext: string, key: string): string => {
  const result = AES.decrypt(ciphertext, key).toString(enc.Utf8);
  console.log('Decryption result: ', result);
  return AES.decrypt(ciphertext, key).toString(enc.Utf8);
};

const encrypt = (text: string, key: string): string => {
  const result = AES.encrypt(text, key).toString();
  return result;
};

const generateId = (length: number): string => {
  var result = '';
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charLen = chars.length;
  for (var i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charLen));
  }
  return result;
};

const getEnvironmentVariable = (variable: string): string => {
  let value: string | undefined = '';
  if (Object.keys(process.env).length > 0) {
    value = process.env[variable];
    if (!value) {
      throw new Error(`Environment variable ${variable} not found!`);
    }
  }

  return value;
};

const getNodeInfoFromNetworkId = (networkId: string): NodeInfo => {
  let node: NodeInfo = {} as any;
  switch (networkId.toLowerCase()) {
    case 'testnet': {
      node.nodeUrl = 'https://rpc.testnet.near.org';
      node.explorerUrl = 'https://explorer.testnet.near.org';
      return node;
    }
    default:
      throw new Error('Invalid NETWORK_ID');
  }
};

const getTxnSuccessValue = (
  status: FinalExecutionStatus | FinalExecutionStatusBasic
) => {
  let st = status as FinalExecutionStatus;
  let result = st.SuccessValue
    ? Buffer.from(st.SuccessValue, 'base64').toString('utf-8')
    : '';
  return result;
};

const getPasteUx = async (host: string, pasteId: string) => {
  let paste: PasteUx | null = null;
  let response = await fetch(`${host}/api/paste?id=${pasteId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  let data: HttpResponse = await response.json();
  if (data.data) {
    let pasteData = data.data as HttpPasteGetResponse;
    paste = {
      content: pasteData.content,
      createdAt: new Date(pasteData.timestamp * 1000).toUTCString(),
      id: pasteData.id,
      isEncrypted: pasteData.isEncrypted,
      title: pasteData.title,
    };
  }

  return paste;
};

export {
  decrypt,
  encrypt,
  getEnvironmentVariable,
  generateId,
  getNodeInfoFromNetworkId,
  getTxnSuccessValue,
  getPasteUx,
};
