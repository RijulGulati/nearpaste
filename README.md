# NEAR Paste

NEAR Paste is an open-source blockchain-based Pastebin built on NEAR Protocol. The server has zero knowledge about any pasted data. Data is encrypted/decrypted using AES encryption in the browser itself.

**The application neither requires user to login/signup nor connecting to any wallet. All pastes are funded by app's account itself.**

Testnet account: [nearpaste.testnet](https://explorer.testnet.near.org/accounts/nearpaste.testnet)

# Features

- Paste encryption with Password: Encryption/decryption of data takes place in-browser. Your password is NEVER sent to server.
- Zero-knowledge access: Server has no knowledge about any paste data being sent to blockchain.
  - **Note:** The server does not log any paste data. However, paste data content is visible in NEAR explorer. It is suggested to use password.

# Smart contract

The contract code is written in Rust. Code is available in [`contract/`](https://github.com/RijulGulati/nearpaste/tree/main/contract) directory. Build instructions are available below.

# Build

## Rust contract

- Requires [Rust](https://www.rust-lang.org/) and [`wasm`](https://rustwasm.github.io/docs/book/) toolchain. Detailed setup instructions are available [here](https://docs.near.org/docs/develop/contracts/rust/intro#1-install-rustup)

### Build contract

```sh
$ cd contract/
$ cargo build --target wasm32-unknown-unknown --release
```

This will generate `nearpaste.wasm` binary in `target/wasm32-unknown-unknown/release` directory.

### Deploy

```sh
$ near deploy <account_id> --wasmFile target/wasm32-unknown-unknown/release/nearpaste.wasm --initFunction 'new' --initArgs '{}'
```

Where `<account_id>` is NEAR Account Id.

### Run tests

```sh
$ cargo test
```

## NextJs application

- Requires [NodeJs](https://nodejs.org/en/) and `yarn` installed.
- The following environment variables are required:

  - `NEAR_ACCOUNT_ID=<account_id> # Eg: nearpaste.testnet`
  - `NEAR_NETWORK_ID=testnet # or mainnet - TODO: add mainnet support`
  - `NEAR_ACCOUNT_PRIVATE_KEY=<private_key> # account private key`

  Create a new file `.env.local` in application root and above mentioned variables.

### Run development environment

```sh
$ yarn dev
```

### Production build

```sh
$ yarn build
```

# Contributions

All kinds of contributions are welcome. Please raise a pull request or create an Issue.

# Contacts

Feel free to get in touch with me on [Discord](https://discordapp.com/users/778312151467163670) or [Telegram](https://t.me/rijulgulati).

# License

[MIT](https://github.com/RijulGulati/nearpaste/blob/main/LICENSE)
