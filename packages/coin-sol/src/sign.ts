import { apdu, error, Transport, tx } from '@coolwallet/core';
import * as ethUtil from './utils/solUtils';
import { handleHex } from './utils/stringUtil';
import { signMsg, signTx } from './config/types';

const Web3 = require('web3');
const rlp = require('rlp');

/**
 * sign ETH Transaction
 * @param {Transport} transport
 * @param {string} appId
 * @param {String} appPrivateKey
 * @param {coinType} coinType
 * @param {{nonce:string, gasPrice:string, gasLimit:string, to:string,
 * value:string, data:string, chainId: number}} transaction
 * @param {Number} addressIndex
 * @param {String} publicKey
 * @param {Function} confirmCB
 * @param {Function} authorizedCB
 * @return {Promise<string>}
 */
export const signTransaction = async (
  signTxData: signTx,
  script: string,
  argument: string,
  publicKey: string | undefined = undefined,
): Promise<string> => {
  const { transport, transaction } = signTxData;

  const rawPayload = ethUtil.getRawHex(transaction);

  const preActions = [];
  let action;
  const sendScript = async () => {
    await apdu.tx.sendScript(transport as Transport, script);
  };
  preActions.push(sendScript);

  action = async () => {
    return apdu.tx.executeScript(
      transport as Transport,
      signTxData.appId,
      signTxData.appPrivateKey,
      argument
    );
  };
  const canonicalSignature = await tx.flow.getSingleSignatureFromCoolWallet(
    transport as Transport,
    preActions,
    action,
    false,
    signTxData.confirmCB,
    signTxData.authorizedCB,
    true
  );

  // return serializedTx
  return new Promise(resolve => resolve(""))
};

/**
 * Sign Message.
 * @return {Promise<String>}
 */
export const signMessage = async (
  signMsgData: signMsg,
  script: string,
  argument: string,
  publicKey: string | undefined = undefined
) => {

  const { transport, message } = signMsgData


  const preActions = [];

  const sendScript = async () => {
    await apdu.tx.sendScript(transport as Transport, script);
  }
  preActions.push(sendScript);

  const action = async () => {
    return apdu.tx.executeScript(
      transport as Transport,
      signMsgData.appId,
      signMsgData.appPrivateKey,
      argument
    );
  }

  const canonicalSignature = await tx.flow.getSingleSignatureFromCoolWallet(
    transport as Transport,
    preActions,
    action,
    false,
    signMsgData.confirmCB,
    signMsgData.authorizedCB,
    true
  );

  const msgHex = handleHex(Web3.utils.toHex(message));
  const msgBuf = Buffer.from(msgHex, 'hex');

  const _19Buf = Buffer.from("19", 'hex');
  const prefix = "Ethereum Signed Message:";
  const lfBuf = Buffer.from("0A", 'hex')
  const len = msgBuf.length.toString();

  const prefixBuf = Buffer.from(prefix, 'ascii');
  const lenBuf = Buffer.from(len, 'ascii');
  const payload = Buffer.concat([_19Buf, prefixBuf, lfBuf, lenBuf, msgBuf]);

  // return signature
  return new Promise(resolve => resolve(""))
};
