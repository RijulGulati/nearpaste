import { AES, enc } from "crypto-js";
import { StringOptionsWithImporter } from "sass";

import * as NearHelper from "./near";

const BASE_URL = process.env.BASE_URL
  ? process.env.BASE_URL
  : "http://localhost:3000";

interface PasteUx {
  id: string;
  title: string;
  content: string;
  isEncrypted: boolean;
  timestamp: number;
}

export class Paste {
  title: string = "";
  content: string = "";
  password?: string = "";
  isEncrypted: boolean = false;

  constructor(title: string, content: string, password?: string) {
    this.title = title;
    this.content = content;
    this.password = password;
    if (this.password) {
      this.title = encrypt(this.title, this.password);
      this.content = encrypt(this.content, this.password);
      this.isEncrypted = true;
    }
  }

  async createPaste() {
    let id = generateId(7);
    let executionOutcome = await NearHelper.createPaste(
      id,
      this.title,
      this.content,
      this.isEncrypted
    );

    return { executionOutcome, id };
  }

  static GetPaste(id: string) {}
}

const decrypt = (ciphertext: string, key: string): string => {
  debugger;
  const result = AES.decrypt(ciphertext, key).toString(enc.Utf8);
  console.log("Decryption result: ", result);
  return AES.decrypt(ciphertext, key).toString(enc.Utf8);
};

const encrypt = (text: string, key: string): string => {
  const result = AES.encrypt(text, key).toString();
  return result;
};

const generateId = (length: number): string => {
  var result = "";
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charLen = chars.length;
  for (var i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charLen));
  }
  return result;
};

export { decrypt, encrypt, BASE_URL };

export type { PasteUx };
