import Web3 from "web3";
import elliptic from 'elliptic'
import { handleHex } from './stringUtil'
import { Transaction } from '../config/types';

const ec = new elliptic.ec('secp256k1');

/**
 * Get raw payload
 * @param {{nonce:string, gasPrice:string, gasLimit:string, to:string,
 * value:string, data:string, chainId: number}} transaction
 * @return {Array<Buffer>}
 */
export const getRawHex = (transaction: Transaction): Array<Buffer> => {
  const rawData = [];
  rawData.push(transaction.nonce);
  rawData.push(transaction.gasPrice);
  rawData.push(transaction.gasLimit);
  rawData.push(transaction.to);
  rawData.push(transaction.value);
  rawData.push(transaction.data);
  const raw = rawData.map((d) => {
    const hex = handleHex(d);
    if (hex === '00' || hex === '') {
      return Buffer.allocUnsafe(0);
    }
    return Buffer.from(hex, 'hex');
  });
  raw[6] = Buffer.from([transaction.chainId]);
  raw[7] = Buffer.allocUnsafe(0);
  raw[8] = Buffer.allocUnsafe(0);

  return raw;
};

/**
 * @description Trim Hex for Address
 * @param {string} hexString expect 32 bytes address in topics
 * @return {string} 20 bytes address + "0x" prefixed
 */
function trimFirst12Bytes(hexString: string): string {
  return "0x".concat(hexString.substr(hexString.length - 40));
}

/**
 * Convert public key to address
 * @param {string} compressedPubkey
 * @return {string}
 */
export function pubKeyToAddress(compressedPubkey: string): string {
  const keyPair = ec.keyFromPublic(compressedPubkey, "hex");
  const pubkey = `0x${keyPair.getPublic(false, "hex").substr(2)}`;
  const address = trimFirst12Bytes(Web3.utils.keccak256(pubkey));
  return Web3.utils.toChecksumAddress(address);
}
