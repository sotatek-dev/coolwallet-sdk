import { Transport } from '@coolwallet/core';
import Matic from '@coolwallet/matic';
import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import Web3 from 'web3';
import Inputs from '../../Inputs';
import erc20ABI from './erc20-abi.json';
import SMCABI from './smart-contract-abi.json';

const web3 = new Web3('https://matic-mainnet.chainstacklabs.com');

interface Props {
  transport: Transport | null;
  appPrivateKey: string;
  appPublicKey: string;
  isLocked: boolean;
  setIsLocked: (isLocked: boolean) => void;
}

function CoinMatic(props: Props) {
  const { transport, appPrivateKey } = props;
  const disabled = !transport || props.isLocked;
  const matic = new Matic();

  const [address, setAddress] = useState('');
  const [smcTx, setSmcTx] = useState({
    sc: '0x1cE84db0841829E10191E86758A187C026Abb6D7', to: '0xCc4949373fBDf5CB53c1d4b9DdF59F46d40bDfFF', value: '1', gasLimit: '', data: '',
    symbol: '',
    decimals: '',
  });

  const [legacy, setLegacy] = useState({
    to: '0xCc4949373fBDf5CB53c1d4b9DdF59F46d40bDfFF',
    value: '0.001',
    result: ''
  })

  const [eip1559, setEip1559] = useState({
    to: '0xCc4949373fBDf5CB53c1d4b9DdF59F46d40bDfFF',
    value: '0.001',
    result: ''
  })

  const [message, setMessage] = useState({
    message: 'matic sign message',
    result: ''
  })

  const handleState = async (request: () => Promise<string>, handleResponse: (response: string) => void) => {
    props.setIsLocked(true);
    try {
      const response = await request();
      handleResponse(response);
    } catch (error: any) {
      handleResponse(error.message);
      console.error(error);
    } finally {
      props.setIsLocked(false);
    }
  };

  const getAddress = async () => {
    handleState(async () => {
      const appId = localStorage.getItem('appId');
      if (!appId) throw new Error('No Appid stored, please register!');
      const address = await matic.getAddress(transport!, appPrivateKey, appId, 0);
      return address;
    }, setAddress);
  };

  const signLegacy = async () => {
    handleState(async () => {
      let transactionData = legacy.data ? `0x${legacy.data}` : "";
      // const transaction = {
      //   ...
      //   to: to
      //   data: '',
      // }; //coin-matic-normal-tx sample-data

      // const transaction = {  
      //   ...
      //   to: '0xdd0Db7aA1E23E38AaEf1FC3A5b7CF32c8574b414',
      //   data: 'S',
      //   option: { info: { symbol: 'FXT', decimals: '18' } },
      // }; //coin-matic-normal-tx-erc20 sample-data

      // const transaction = {
      //   ...
      //   to: '0x1cE84db0841829E10191E86758A187C026Abb6D7',
      //   data: '0x60fe47b10000000000000000000000000000000000000000000000000000000000000004',
      // }; //coin-matic-normal-tx-sc sample-data
      let gasLimit
      if (smcTx.gasLimit) {
        transactionData = legacy.data;
        gasLimit = smcTx.gasLimit
      }
      else {
        gasLimit = web3.utils.toHex(await web3.eth.estimateGas({ to: legacy.to }))
      }
      const transaction = {
        chainId: "137",
        nonce: web3.utils.toHex(await web3.eth.getTransactionCount(address, 'pending')),
        gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
        gasLimit,
        to: legacy.to,
        value: legacy.value === "0" ? "0x00" : web3.utils.toHex(web3.utils.toWei(legacy.value, 'ether')), // 0.001
        data: transactionData,
        option: { info: { symbol: smcTx.symbol, decimals: smcTx.decimals } },
      };
      console.log('transaction', transaction);


      const appId = localStorage.getItem('appId');
      if (!appId) throw new Error('No Appid stored, please register!');

      const signedTx = await matic.signTransaction({ transport, appPrivateKey, appId, addressIndex: 0, transaction }); // sign legacy tx      

      return signedTx;
    }, (result) => setLegacy(prevState => ({
      ...prevState,
      result
    }))
    );
  };

  const signEIP1559 = async () => {
    handleState(async () => {
      //  const transaction = {
      //      ...
      //     to: to,
      //     data: '',
      //   }; //coin-matic-EIP1559-transfer sample-data

      //  const transaction = {
      //   ...
      //   to: '0x1cE84db0841829E10191E86758A187C026Abb6D7',
      //   data: '0x60fe47b10000000000000000000000000000000000000000000000000000000000000004',
      // }; //coin-matic-EIP1559-sc sample-data

      //  const transaction = {
      //     ...
      //     to: '0xdd0Db7aA1E23E38AaEf1FC3A5b7CF32c8574b414',
      //     data: '0xa9059cbb000000000000000000000000cc4949373fbdf5cb53c1d4b9ddf59f46d40bdfff000000000000000000000000000000000000000000000000002386f26fc10000',
      //     option: { info: { symbol: 'FXT', decimals: '18' } },
      //   }; //coin-matic-EIP1559-erc20 sample-data

      let transactionData = smcTx.data ? `0x${smcTx.data}` : "";
      let gasLimit
      if (smcTx.gasLimit) {
        transactionData = smcTx.data;
        gasLimit = smcTx.gasLimit
      }
      else {
        gasLimit = web3.utils.toHex(await web3.eth.estimateGas({ to: eip1559.to, data: transactionData }))
      }

      const transaction = {
        nonce: web3.utils.toHex(await web3.eth.getTransactionCount(address, 'pending')),
        gasTipCap: web3.utils.toHex(await web3.eth.getGasPrice()),
        gasFeeCap: web3.utils.toHex(await web3.eth.getGasPrice()),
        gasLimit,
        to: eip1559.to,
        value: web3.utils.toHex(web3.utils.toWei(eip1559.value, 'ether')),
        data: transactionData,
        option: { info: { symbol: smcTx.symbol, decimals: smcTx.decimals } },
      };

      const appId = localStorage.getItem('appId');
      if (!appId) throw new Error('No Appid stored, please register!');

      const signedTx = await matic.signEIP1559Transaction({
        transport,
        appPrivateKey,
        appId,
        addressIndex: 0,
        transaction,
      });

      return signedTx;
    }, (result) => setEip1559(prevState => ({
      ...prevState,
      result
    }))
    );
  }

  const signMessage = async () => {
    handleState(async () => {
      const appId = localStorage.getItem('appId');
      if (!appId) throw new Error('No Appid stored, please register!');

      const signedTx = await matic.signMessage({
        transport,
        appPrivateKey,
        appId,
        addressIndex: 0,
        message: message.message,
      });

      return signedTx;
    }, (result) => setMessage(prevState => ({
      ...prevState,
      result
    }))
    );
  }

  const getContractGas = async () => {
    try {
      if (!legacy.symbol || !legacy.decimals) {
        const contract = new web3.eth.Contract(SMCABI, smcTx.sc);
        const transfer = contract.methods.set(web3.utils.toWei(smcTx.value, 'ether'));
        const data = transfer.encodeABI();
        const gasLimit = `0x${await transfer.estimateGas({ from: address })}`;
        setSmcTx(prevState => ({
          ...prevState,
          gasLimit, data
        }))
        return;
      }
      const contract = new web3.eth.Contract(erc20ABI, smcTx.sc);
      const transfer = contract.methods.transfer(smcTx.to, web3.utils.toWei(smcTx.value, 'ether'));
      const data = transfer.encodeABI();
      const gasLimit = `0x${await transfer.estimateGas({ from: address })}`;
      setSmcTx(prevState => ({
        ...prevState, data,
        gasLimit
      }))

    } catch (error) {
      console.log(error);

    }

  }

  return (
    <Container>
      <div className='title2'>These two basic methods are required to implement in a coin sdk.</div>
      <Inputs btnTitle='Get Address' title='Get' content={address} onClick={getAddress} disabled={disabled} />

      <Inputs
        btnTitle='Estimate'
        title='Contract Estimate Gas'
        content={smcTx.data}
        onClick={getContractGas}
        disabled={disabled}
        inputs={[
          {
            xs: 1,
            value: smcTx.sc,
            onChange: (sc) => setSmcTx(prevState => ({
              ...prevState,
              sc
            })),
            placeholder: 'Contract Address',
          },
          {
            xs: 1,
            value: smcTx.to,
            onChange: (to) => setSmcTx(prevState => ({
              ...prevState,
              to
            })),
            placeholder: 'to',
          }, {
            xs: 1,
            value: smcTx.value,
            onChange: (value) => setSmcTx(prevState => ({
              ...prevState,
              value
            })),
            placeholder: 'value',
          }, {
            xs: 1,
            value: legacy.symbol,
            onChange: (symbol) => setSmcTx(prevState => ({
              ...prevState,
              symbol
            })),
            placeholder: 'symbol',
          }, {
            xs: 1,
            value: legacy.decimals,
            onChange: (decimals) => setSmcTx(prevState => ({
              ...prevState,
              decimals
            })),
            placeholder: 'decimals',
          },

        ]}
      />

      <Inputs
        btnTitle='Sign'
        title='Sign Legacy'
        content={legacy.result}
        onClick={signLegacy}
        disabled={disabled}
        inputs={[
          {
            xs: 1,
            value: legacy.to,
            onChange: (to) => setLegacy(prevState => ({
              ...prevState,
              to
            })),
            placeholder: 'to',
          },
          {
            xs: 1,
            value: legacy.value,
            onChange: (value) => setLegacy(prevState => ({
              ...prevState,
              value
            })),
            placeholder: 'value',
          },
        ]}
      />
      <Inputs
        btnTitle='Sign EIP1559'
        title='Sign EIP1559'
        content={eip1559.result}
        onClick={signEIP1559}
        disabled={disabled}
        inputs={[
          {
            xs: 1,
            value: eip1559.to,
            onChange: (to) => setEip1559(prevState => ({
              ...prevState,
              to
            })),
            placeholder: 'to',
          },
          {
            xs: 1,
            value: eip1559.value,
            onChange: (value) => setEip1559(prevState => ({
              ...prevState,
              value
            })),
            placeholder: 'value',
          }
        ]}
      />
      <Inputs
        btnTitle='Sign'
        title='Sign Message'
        content={message.result}
        onClick={signMessage}
        disabled={disabled}
        inputs={[
          {
            value: message.message,
            onChange: (message) => setMessage(prevState => ({
              ...prevState,
              message
            })),
            placeholder: 'message',
          }
        ]}
      />
    </Container>
  );
}

export default CoinMatic;
