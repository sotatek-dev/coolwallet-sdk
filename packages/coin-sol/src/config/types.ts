import { transport } from '../../../core/src';

export type Output = {
  address: string,
  value: number
}

export type Transport = transport.default;

export type Option = {
  info : {
    symbol: string,
    decimals: string
  }
};

export type Transaction = {
  chainId: number,
  nonce: string,
  gasPrice: string,
  gasLimit: string,
  to: string,
  value: string,
  data: string,
  option: Option
}

export type signTx = {
  transaction: Transaction
  transport: Transport,
  appPrivateKey: string,
  appId: string,
  addressIndex: number,
  publicKey: string | undefined,
  confirmCB?: () => void | undefined,
  authorizedCB?: () => void | undefined
}

export type signMsg = {
  message: string,
  transport: Transport,
  appPrivateKey: string,
  appId: string,
  addressIndex: number,
  publicKey: string | undefined,
  confirmCB?: () => void | undefined,
  authorizedCB?: () => void | undefined
}
