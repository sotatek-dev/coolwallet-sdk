/* eslint-disable no-param-reassign */
import { coin as COIN, setting, apdu } from '../../core/src';
import { pubKeyToAddress } from './utils/solUtils';
import { TOKENTYPE } from './config/tokenType';
import * as params from './config/params';
import * as types from './config/types';

export { TOKENTYPE };

export default class SOL extends COIN.ECDSACoin implements COIN.Coin {
  constructor() {
    super(params.COIN_TYPE);
  }

  /**
   * !required
   * @param transport 
   * @param appPrivateKey 
   * @param appId 
   * @param addressIndex 
   * @returns 
   */
  async getAddress(
    transport: types.Transport,
    appPrivateKey: string,
    appId: string,
    addressIndex: number
  ): Promise<string> {
    // Step 1: get public by card info {transport, appId, addressIndex, appPrivateKey}
    const publicKey = await this.getPublicKey(
      transport, appPrivateKey, appId, addressIndex
    );

    // Step 2: from public key get address
    return pubKeyToAddress(publicKey);
  }

  /**
   * !required
   * @param signTxData 
   * @returns 
   */
  async signTransaction(signTxData: types.signTx): Promise<string> {
    const { value, data, to } = signTxData.transaction;

    return new Promise(resolve => resolve(""))
  }

  /**
   * optional
   * @param ignMsgData 
   * @returns 
   */
  async signMessage(ignMsgData: types.signMsg): Promise<string> {
    return new Promise(resolve => resolve(""))
  }
}

