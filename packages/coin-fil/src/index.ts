/* eslint-disable no-param-reassign */
import { coin as COIN, setting, apdu, Transport } from '@coolwallet/core';
import * as ethSign from './sign';
import { pubKeyToAddress } from './utils/filUtils';
import * as types from './config/types';
import * as scriptUtils from './utils/scriptUtils';
import * as params from './config/params';

const convertEIP1559IntoLegacyTx = (eip1559Tx: types.signEIP1559Tx): types.signTx => {
  const tx: types.Transaction = {
    chainId: 1,
    gasPrice: eip1559Tx.transaction.gasFeeCap,
    ...eip1559Tx.transaction,
  };
  return { ...eip1559Tx, transaction: tx };
};

export default class FIL extends COIN.ECDSACoin implements COIN.Coin {
  constructor() {
    super(params.COIN_TYPE);
  }

  async getAddress(transport: Transport, appPrivateKey: string, appId: string, addressIndex: number): Promise<string> {
    const { accountPublicKey, accountChainCode } = await this.getAccountPubKeyAndChainCode(
      transport,
      appPrivateKey,
      appId,
      addressIndex,
      5
    );
    console.log('acc, chain: ', { accountPublicKey, accountChainCode })
    const publicKey = this.getAddressPublicKey(accountPublicKey, accountChainCode, addressIndex);
    console.log('publicKey : ', publicKey)
    return pubKeyToAddress(publicKey);
    // return pubKeyToAddress(publicKey.accountPublicKey + publicKey.accountChainCode);
  }

  async getAddressByAccountKey(accPublicKey: string, accChainCode: string, addressIndex: number): Promise<string> {
    const publicKey = this.getAddressPublicKey(accPublicKey, accChainCode, addressIndex);
    return pubKeyToAddress(publicKey);
  }

  async signTransaction(signTxData: types.signTx): Promise<string> {
    return '';
    // const { value, data, to } = signTxData.transaction;
    // // eth
    // if (value && !data) {
    //   return this.signTransferTransaction(signTxData);
    // }
    //
    // // erc20
    // const functionHash = data.startsWith('0x') ? data.slice(2, 10) : data.slice(0, 8);
    //
    // if (data && functionHash === 'a9059cbb') {
    //   const upperCaseAddress = to.toUpperCase(); // contractAddr
    //   let tokenSignature;
    //   for (const tokenInfo of TOKENTYPE) {
    //     // get tokenSignature
    //     if (tokenInfo.contractAddress.toUpperCase() === upperCaseAddress) {
    //       tokenSignature = tokenInfo.signature;
    //       signTxData.transaction.option.info.symbol = tokenInfo.symbol;
    //       signTxData.transaction.option.info.decimals = tokenInfo.unit;
    //       break;
    //     }
    //   }
    //
    //   const { symbol, decimals } = signTxData.transaction.option.info;
    //   if (symbol && decimals) {
    //     if (tokenSignature) {
    //       // 內建
    //       return this.signERC20Transaction(signTxData, tokenSignature);
    //     }
    //     // 自建
    //     return this.signERC20Transaction(signTxData);
    //   }
    // }
    //
    // // smart contract
    // return this.signSmartContractTransaction(signTxData);
  }

  async signTransferTransaction(signTxData: types.signTx): Promise<string> {
    const { transport, appPrivateKey, appId, addressIndex, transaction } = signTxData;
    const publicKey = await this.getPublicKey(transport, appPrivateKey, appId, addressIndex);
    const argument = await scriptUtils.getTransferArgument(transaction, addressIndex);
    const script = params.TRANSFER.scriptWithSignature;

    return ethSign.signTransaction(signTxData, script, argument, publicKey);
  }

  async signERC20Transaction(signTxData: types.signTx, tokenSignature = '') {
    // const { transport, appPrivateKey, appId, addressIndex, transaction } = signTxData;
    // const publicKey = await this.getPublicKey(transport, appPrivateKey, appId, addressIndex);
    // const argument = await scriptUtils.getERC20Argument(transaction, tokenSignature, addressIndex);
    // const script = params.ERC20.scriptWithSignature;
    //
    // return ethSign.signTransaction(signTxData, script, argument, publicKey);
  }

  async signSmartContractTransaction(signTxData: types.signTx): Promise<string> {
    const { transport, appPrivateKey, appId, addressIndex, transaction } = signTxData;
    const publicKey = await this.getPublicKey(transport, appPrivateKey, appId, addressIndex);
    // if data bytes is larger than 4000 sign it segmentally.
    if (signTxData.transaction.data.length > 8000) {
      const script = params.SmartContractSegment.scriptWithSignature;
      const argument = await scriptUtils.getSmartContractArgumentSegment(transaction, addressIndex);
      return ethSign.signSmartContractTransaction(signTxData, script, argument, publicKey);
    }
    const script = params.SmartContract.scriptWithSignature;
    const argument = await scriptUtils.getSmartContractArgument(transaction, addressIndex);
    return ethSign.signTransaction(signTxData, script, argument, publicKey);
  }

  async signMessage(signMsgData: types.signMsg): Promise<string> {
    await setting.auth.versionCheck(signMsgData.transport, 81);

    const { transport, appPrivateKey, appId, addressIndex, message } = signMsgData;
    const publicKey = await this.getPublicKey(transport, appPrivateKey, appId, addressIndex);
    const argument = await scriptUtils.getSignMessageArgument(message, addressIndex);
    const script = params.SIGN_MESSAGE.scriptWithSignature;

    return ethSign.signMessage(signMsgData, script, argument, publicKey);
  }

  async signTypedData(typedData: types.signTyped): Promise<string> {
    await setting.auth.versionCheck(typedData.transport, 84);

    const { transport, appPrivateKey, appId, addressIndex } = typedData;
    const publicKey = await this.getPublicKey(transport, appPrivateKey, appId, addressIndex);
    const script = params.SIGN_TYPED_DATA.scriptWithSignature;

    return ethSign.signTypedData(typedData, script, publicKey);
  }
}
