import { AES } from 'crypto-js';

import * as NearHelper from './near';

export class Paste {
  title: string = '';
  content: string = '';
  password?: string = '';
  isEncrypted: boolean = false;

  constructor(title: string, content: string, password?: string) {
    this.title = title;
    this.content = content;
    this.password = password;
    if (this.password) {
      this.title = AES.encrypt(this.title, this.password).ciphertext.toString();
      this.content = AES.encrypt(
        this.content,
        this.password
      ).ciphertext.toString();
      this.isEncrypted = true;
    }
  }

  async createPaste() {
    debugger;
    let id = generateId(7);
    let result = await NearHelper.createPaste(
      id,
      this.title,
      this.content,
      this.isEncrypted
    );

    return result;
  }

  static GetPaste(id: string) {}
}

const generateId = (length: number): string => {
  var result = '';
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charLen = chars.length;
  for (var i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charLen));
  }
  return result;
};
