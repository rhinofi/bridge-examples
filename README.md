# rhino.fi bridge API integration examples

## Setup

### Install dependencies

To install the necessary dependencies, run:

```sh
yarn
```

### Populate the `.env` file

Create a `.env` file in the root directory of the project and add the following environment variables:

Use the `.env.example` file as a template

```
EVM_PRIVATE_KEY=your_ethereum_private_key
API_URL="https://api.rhino.fi"
RECIPIENT=recipient_address
TON_MNEMONIC=your_ton_mnemonic
SOLANA_PRIVATE_KEY=your_solana_private_key
RHINO_API_KEY=token_provided_by_rhino
```

### How to run

To run the examples, use the following commands:

- For the EVM example:

  ```sh
  yarn evm-example
  ```

- For the TON example:

  ```sh
  yarn ton-example
  ```

- For the Solana example:

  ```sh
  yarn solana-example
  ```

### Running examples

Each example script demonstrates how to interact with the rhino.fi bridge API for different blockchain networks. Ensure you have populated the `.env` file with the required environment variables before running any example.

### About authentication

The Rhino API requires authentication with an api key to access the bridge. Rhino will provide you a key specific for your app upon request that will not expire and is safe to be exposed in the browser. You should always use this key in your production integration.  
If you want to try out the examples before you have received a key from Rhino, you can use the `authenticate` function from `services/authentication` to obtain a temporary api key and use that instead of the `RHINO_API_KEY` environment variable.
