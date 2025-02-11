import type {Address} from '@ton/core'
import {JettonMaster, TonClient} from '@ton/ton'

export const getJettonWalletAddress = async (tonWalletAddress: Address, jettonMasterAddress: Address, publicProvider: TonClient) => {
  if (!publicProvider) {
    throw new Error('Please connect your TON wallet first')
  }

  const jettonMaster = publicProvider.open(JettonMaster.create(jettonMasterAddress))

  return jettonMaster.getWalletAddress(tonWalletAddress)
}
