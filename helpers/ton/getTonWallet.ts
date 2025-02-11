import 'dotenv/config'
import {mnemonicToPrivateKey} from "@ton/crypto";
import {WalletContractV4} from "@ton/ton";

const { TON_MNEMONIC } = process.env

if (!TON_MNEMONIC) {
  throw new Error('TON_MNEMONIC is not defined, add it to your .env file')
}

export const getTonWallet = async () => {
  const mnemonic = TON_MNEMONIC.split(' ');
  const keyPair = await mnemonicToPrivateKey(mnemonic);
  const workchain = 0;
  const wallet = WalletContractV4.create({
    workchain,
    publicKey: keyPair.publicKey,
  })
  return {
    key: keyPair,
    wallet
  }
}