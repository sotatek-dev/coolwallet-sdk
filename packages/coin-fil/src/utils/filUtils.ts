import Web3 from 'web3';
import createKeccakHash from 'keccak';
import { handleHex } from './stringUtil';
import { Transaction } from '../config/types';
import { ec as EC } from 'elliptic';
import blakejs, { blake2b } from 'blakejs';
import base32Encode from 'base32-encode';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const leb = require('leb128');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const rlp = require('rlp');

// eslint-disable-next-line new-cap
const ec = new EC('secp256k1');

const getChecksum = (ingest: Buffer): Uint8Array => {
  return blake2b(ingest, undefined, 4);
};

const encode = (network = 'f', address: Address) => {
  let addressString = '';
  const payload = address.payload;

  switch (address.protocol) {
    case 0: {
      addressString = `network${address.protocol}${leb.unsigned.decode(address.payload)}`;
      break;
    }

    default: {
      const protocolByte = Buffer.alloc(1);
      protocolByte[0] = address.protocol;
      const checksum = getChecksum(Buffer.concat([protocolByte, payload]));
      const bytes = Buffer.concat([payload, Buffer.from(checksum)]);
      addressString = String(network) + String(address.protocol) + base32Encode(bytes, 'RFC4648').slice(0, -1);
      break;
    }
  }

  return addressString;
};

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
  raw[6] = Buffer.from([1]);
  raw[7] = Buffer.allocUnsafe(0);
  raw[8] = Buffer.allocUnsafe(0);

  return raw;
};

/**
 * @description Compose Signed Transaction
 * @param {Array<Buffer>} payload
 * @param {Number} v
 * @param {String} r
 * @param {String} s
 * @param {number} chainId
 * @return {String}
 */
export const composeSignedTransacton = (
  payload: Array<Buffer>,
  v: number,
  r: string,
  s: string,
  chainId: number
): string => {
  const vValue = v + chainId * 2 + 8;

  const transaction = payload.slice(0, 6);

  transaction.push(Buffer.from([vValue]), Buffer.from(r, 'hex'), Buffer.from(s, 'hex'));

  const serializedTx = rlp.encode(transaction);
  return `0x${serializedTx.toString('hex')}`;
};

/**
 * @description Generate Canonical Signature from Der Signature
 * @param {{r:string, s:string}} canonicalSignature
 * @param {Buffer} payload
 * @param {String} compressedPubkey hex string
 * @return {Promise<{v: Number, r: String, s: String}>}
 */
export const genEthSigFromSESig = async (
  canonicalSignature: { r: string; s: string },
  payload: Buffer,
  compressedPubkey: string | undefined = undefined
): Promise<{ v: number; r: string; s: string }> => {
  const data = createKeccakHash('keccak256').update(payload).digest();
  const keyPair = ec.keyFromPublic(compressedPubkey!, 'hex');

  // get v
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const recoveryParam = ec.getKeyRecoveryParam(data, canonicalSignature, keyPair.getPublic());
  const v = recoveryParam + 27;
  const { r } = canonicalSignature;
  const { s } = canonicalSignature;

  return { v, r, s };
};

/**
 * @description get APDU set token function
 * @param {String} address
 * @return {Function}
 */
// export const apduSetToken = (contractAddress, symbol, decimals, sn = 1) => async () => {
//   const setTokenPayload = token.getSetTokenPayload(contractAddress, symbol, decimals);
//   await apdu.tx.setCustomToken(setTokenPayload, sn);
// };

/**
 * @description Trim Hex for Address
 * @param {string} hexString expect 32 bytes address in topics
 * @return {string} 20 bytes address + "0x" prefixed
 */
function trimFirst12Bytes(hexString: string): string {
  return '0x'.concat(hexString.substr(hexString.length - 40));
}

/**
 * Convert public key to address
 * @param {string} compressedPubkey
 * @return {string}
 */
// export function pubKeyToAddress(compressedPubkey: string): string {
//   const keyPair = ec.keyFromPublic(compressedPubkey, 'hex');
//   const pubkey = `0x${keyPair.getPublic(false, 'hex').substr(2)}`;
//   const address = trimFirst12Bytes(Web3.utils.keccak256(pubkey));
//   return Web3.utils.toChecksumAddress(address);
// }

type Address = {
  protocol: number;
  payload: Buffer;
};

export function pubKeyToAddress(publicKey: string, network = 'f'): string {
  const payload: Uint8Array = blakejs.blake2b(Buffer.from(publicKey, 'hex'), undefined, 20);
  console.log('payload: ', payload);
  const payloadBuf = Buffer.from(payload.buffer);
  console.log('payloadBuf: ', payloadBuf.toString('hex'));
  const rawAddress: Address = { protocol: 1, payload: payloadBuf };
  console.log('rawAddress: ', rawAddress);
  return network ? encode(network, rawAddress) : `${rawAddress.protocol}${rawAddress.payload}`;
}