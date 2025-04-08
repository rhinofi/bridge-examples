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
RHINO_API_KEY=api_key_provided_by_rhino
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

The Rhino API requires authentication with a JSON Web Token (JWT) to access the bridge. Rhino will provide you an API key specific for your app upon request. This API key is then used to obtain a JWT to make authenticated API requests. You should always use this key in your production integration.  
If you want to try out the examples before you have received a key from Rhino, you can replace usages of the `authenticateWithApiKey` with the `authenticateWithWallet` function from `services/authentication` to obtain a JWT like a Rhino webapp user. Please note that this should only be used for testing purposes and not be used in a production integration.  

### Resources

You can find more details on the Rhino API in our [documentation](https://docs.rhino.fi/api/introduction).

If you use JavaScript/TypeScript for you integration, you might also want to use [our SDK](https://docs.rhino.fi/sdk/quickstart) which makes integrating Rhino even easier.
