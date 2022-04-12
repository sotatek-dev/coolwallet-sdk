import { useState } from 'react';
import Web3 from 'web3';
import { Container } from 'react-bootstrap';
import CoinFil from '@coolwallet/fil';
import { Transport } from '@coolwallet/core';
import Inputs from '../../Inputs';
import { useRequest } from '../../../utils/hooks';
import type { FC } from 'react';

interface Props {
  transport: Transport | null;
  appPrivateKey: string;
  appPublicKey: string;
  isLocked: boolean;
  setIsLocked: (isLocked: boolean) => void;
}

const CoinEthPage: FC<Props> = (props: Props) => {
  const fil = new CoinFil();
  const disabled = !props.transport || props.isLocked;

  const [address, setAddress] = useState('');

  const [normalTxData, setNormalTxData] = useState({
    to: '',
    amount: '',
    result: '',
  });

  const getAddress = () => {
    useRequest(async () => {
      const appId = localStorage.getItem('appId');
      if (!appId) throw new Error('No Appid stored, please register!');
      return fil.getAddress(props.transport!, props.appPrivateKey, appId, 0);
    }, props).then(setAddress);
  };

  const signMessage = () => {
    useRequest(async () => {
      const transaction = {
        from: address,
        to: normalTxData.to,
        amount: normalTxData.amount,
      };

      const appId = localStorage.getItem('appId');
      if (!appId) throw new Error('No Appid stored, please register!');

      const signTxData = {
        transport: props.transport!,
        appPrivateKey: props.appPrivateKey,
        appId,
        transaction: transaction,
        addressIndex: 0,
        option,
      };

      const signedTx = await fil.signSmartContractTransaction(signTxData);
      console.log('signedTx UI :', signedTx);

      // await web3.eth.sendSignedTransaction(signedTx);

      return signedTx;
    }, props).then((result) => setNormalTxData((prev) => ({ ...prev, result })));
  };

  return (
    <Container>
      <div className='title2'>These two basic methods are required to implement in a coin sdk.</div>
      <Inputs btnTitle='Get Address' title='Get' content={address} onClick={getAddress} disabled={disabled} />
      <Inputs
        btnTitle='Sign'
        title='Sign Smart Contract'
        content={normalTxData.result}
        onClick={signMessage}
        disabled={disabled}
        inputs={[
          {
            value: normalTxData.to,
            onChange: (to) => setNormalTxData((prev) => ({ ...prev, to })),
            placeholder: 'from',
          },
          {
            value: normalTxData.amount,
            onChange: (amount) => setNormalTxData((prev) => ({ ...prev, amount })),
            placeholder: 'from',
          },
        ]}
      />
    </Container>
  );
};

export default CoinEthPage;
