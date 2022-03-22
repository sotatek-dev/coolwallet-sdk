import { utils, config } from '@coolwallet/core';
import * as params from '../config/params';
import base58 from 'bs58';
import { messageType } from '../config/types';
import { handleHex } from './stringUtil';

/**
 * TODO
 * @param {messageType} message
 * @returns {Promise<string>}
 */
export const getTransferArguments = async (message: messageType): Promise<string> => {
  const pathType = config.PathType.SLIP0010;
  const path = await utils.getPath(params.COIN_TYPE, 0, 3, pathType);
  const SEPath = `0D${path}`;
  console.debug('SEPath: ', SEPath);
  let argument = messageSerialize(message);

  return SEPath + argument;
};

const numberToStringHex = (value: number | number[], pad: number) =>
  Buffer.from(typeof value === 'number' ? [value] : value)
    .toString('hex')
    .padStart(pad, '0');

const messageSerialize = (message: messageType): string => {
  console.log('🚀 ~ file: scriptUtil.ts ~ line 29 ~ messageSerialize ~ message', message);
  const { numRequiredSignatures, numReadonlySignedAccounts, numReadonlyUnsignedAccounts } = message.header;
  const formattedTx = {
    numberRequireSignature: numberToStringHex(numRequiredSignatures, 2),
    numberReadonlySignedAccount: numberToStringHex(numReadonlySignedAccounts, 2),
    numberReadonlyUnSignedAccount: numberToStringHex(numReadonlyUnsignedAccounts, 2),
    keyCount: numberToStringHex(message.accountKeys.length, 2),
    recentBlockHash: message.recentBlockhash,
  };

  const keys = Buffer.concat(message.accountKeys).toString('hex');

  const recentBlockHash = base58.decode(formattedTx.recentBlockHash).toString('hex');

  let argument =
    handleHex(formattedTx.numberRequireSignature).padStart(2, '0') +
    handleHex(formattedTx.numberReadonlySignedAccount).padStart(2, '0') +
    handleHex(formattedTx.numberReadonlyUnSignedAccount).padStart(2, '0') +
    handleHex(formattedTx.keyCount).padStart(2, '0') +
    keys.padStart(message.accountKeys.length * 64, '0') +
    recentBlockHash.padStart(64, '0') +
    numberToStringHex(message.instructions.length, 2);

  // iterate instruction
  message.instructions.forEach((instruction) => {
    let keyIndicesCount: number[] = [];
    encodeLength(keyIndicesCount, instruction.accounts.length);
    const data = base58.decode(instruction.data);
    let dataCount: number[] = [];
    encodeLength(dataCount, data.length);

    const instructionData =
      numberToStringHex(instruction.programIdIndex, 2) +
      numberToStringHex(keyIndicesCount, 2) +
      numberToStringHex(instruction.accounts, instruction.accounts.length * 2) +
      numberToStringHex(dataCount, 2) +
      data.toString('hex').padStart(data.length * 2, '0');
    argument = argument.concat(instructionData);
  });

  return argument;
};

function encodeLength(bytes: number[], len: number) {
  let rem_len = len;
  for (;;) {
    let elem = rem_len & 0x7f;
    rem_len >>= 7;
    if (rem_len == 0) {
      bytes.push(elem);
      break;
    } else {
      elem |= 0x80;
      bytes.push(elem);
    }
  }
}