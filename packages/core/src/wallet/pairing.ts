import * as apdu from '../apdu/index';
import * as core from '../core/index';
import * as crypto from '../crypto/index';
import * as config from '../config/index';
import * as error from '../error/index';
import Transport from '../transport/index';
import { commands } from "../apdu/command";


const SUCCESS = config.RESPONSE.DFU_RESPONSE.SUCCESS;

/**
 * @param {Transport} transport
 * @param {string} appPublicKey
 * @param {String} password
 * @param {String} deviceName
 * @returns {Promise}
 */
export const register = async (transport: Transport, appPublicKey: string, password: string, deviceName: string): Promise<String> => {
  let nameToUTF = Buffer.from(deviceName, 'utf8');
  const maxLen = 30;

  if (nameToUTF.length < maxLen) {
    const diff = maxLen - nameToUTF.length;
    const temp = Buffer.allocUnsafe(diff);
    temp.fill(0);
    nameToUTF = Buffer.concat([temp, nameToUTF]);
  } else {
    nameToUTF = nameToUTF.slice(0, maxLen);
  }
  const addedPassword = password.padStart(8, 'F');

  const hexNameToUTF = nameToUTF.toString('hex');
  let data = addedPassword + appPublicKey + hexNameToUTF;
  let P1 = '00';

  const supportEncryptedRegister = true;
  if (supportEncryptedRegister) {
    data = crypto.encryption.ECIESenc(config.KEY.SEPublicKey, data);
    P1 = '01';
  }
  const { outputData: appId } = await apdu.execute.executeCommand(transport, commands.REGISTER, 'SE', data, P1);
  return appId;
};

/**
 *
 * @param {Transport} transport
 * @param {string} appId
 * @param {string} appPrivKey
 * @return {Promise<Array<{appId:string, }>>}
 */
export const getPairedApps = async (transport: Transport, appId: string, appPrivKey: string): Promise<Array<{ appId: string; }>> => {
  const { signature, forceUseSC } = await core.auth.getCommandSignature(
    transport,
    appId,
    appPrivKey,
    commands.GET_PAIRED_DEVICES,
    undefined,
    undefined
  );
  const { outputData } = await apdu.execute.executeCommand(
    transport,
    commands.GET_PAIRED_DEVICES,
    'SE',
    signature, undefined, undefined,
    true, forceUseSC
  );
  const appsInfo = outputData.match(/.{100}/g);
  if (!appsInfo) {
    throw new Error('appsInfo is undefined')
  }
  const apps = appsInfo.map((appInfo) => {
    const appId = appInfo.slice(0, 40);
    const appName = Buffer.from(appInfo.slice(40), 'hex')
      .toString()
      // eslint-disable-next-line no-control-regex
      .replace(/\u0000/gi, '');
    return { appId, appName };
  });
  return apps;
};

/**
 * Get Pairing password for current device
 * @param {Transport} transport
 * @param {string} appId
 * @param {string} appPrivKey
 * @return {Promise<string>}
 */
export const getPairingPassword = async (transport: Transport, appId: string, appPrivKey: string): Promise<string> => {
  const { signature, forceUseSC } = await core.auth.getCommandSignature(
    transport,
    appId,
    appPrivKey,
    commands.GET_PAIR_PWD,
    undefined,
    undefined
  );
  const { outputData: encryptedPassword } = await apdu.execute.executeCommand(transport, commands.GET_PAIR_PWD, 'SE', signature, undefined, undefined, true, forceUseSC);

  // const encryptedPassword = await apdu.pairing.getPairingPassword(transport, signature, forceUseSC);
  await apdu.control.powerOff(transport);
  let password = crypto.encryption.ECIESDec(appPrivKey, encryptedPassword);
  if (!password) throw new error.SDKError('getPairingPassword error', 'password is undefined')
  password = password.replace(/f/gi, '');
  return password;
};

/**
 * Remove Paired device by id
 * @param {Transport} transport
 * @param {string} appIdWithSig
 * @return {Promise<boolean>}
 */
export const removePairedDevice = async (transport: Transport, appIdWithSig: string): Promise<boolean> => {
  const { status } = await apdu.execute.executeCommand(transport, commands.REMOVE_DEVICES, 'SE', appIdWithSig);
  return status === SUCCESS;
};

/**
 * Rename current device
 * @param {Transport} transport
 * @param {string} nameWithSig
 * @return {Promise<boolean>}
 */
export const renameDevice = async (transport: Transport, nameWithSig: string): Promise<boolean> => {
  const { status } = await apdu.execute.executeCommand(transport, commands.RENAME_DEVICES, 'SE', nameWithSig);
  return status === SUCCESS;
};