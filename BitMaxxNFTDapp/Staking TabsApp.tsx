import React, { useState } from 'react';
import {
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  Button,
  Text,
  useToast,
} from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useContractWrite, useAccount } from 'wagmi';
import stakingABI from './stakingABI.json';
import './styles.css';

import backgroundGif from './horse.gif';
import MainTextLogo from './headerlogo.png';

const STAKING_CONTRACT_ADDRESS = '0x18ed09d95dc7e670eb917de97127445cd7832ed6'; // Update with correct values

function App() {
  const account = useAccount();
  const { write: deposit } = useContractWrite(STAKING_CONTRACT_ADDRESS, stakingABI, 'deposit');
  const { write: withdraw } = useContractWrite(STAKING_CONTRACT_ADDRESS, stakingABI, 'withdraw');
  const { write: claim } = useContractWrite(STAKING_CONTRACT_ADDRESS, stakingABI, 'claim');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const toast = useToast();



  const handleDeposit = async () => {
    try {
      if (!depositAmount) {
        throw new Error('Please enter a deposit amount.');
      }
      await deposit(depositAmount);
      toast({
        title: 'Deposit Successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setDepositAmount('');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleWithdraw = async () => {
    try {
      if (!withdrawAmount) {
        throw new Error('Please enter a withdraw amount.');
      }
      await withdraw(withdrawAmount);
      toast({
        title: 'Withdrawal Successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setWithdrawAmount('');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleClaim = async () => {
    try {
      await claim();
      toast({
        title: 'Claim Successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <header>
        <img src={MainTextLogo} alt="BitMaxx NFT Collection" className="logo" />
        <div className="connect-button">
          <ConnectButton />
        </div>
      </header>

      <div
        className="wrapper"
        style={{
          backgroundColor: 'black',
          color: 'white',
          backgroundImage: `url(${backgroundGif})`,
          backgroundSize: 'center',
        }}
      >
        <div className="mainboxwrapper">
          <Container className="container" paddingY="4">
            <Tabs isFitted variant="enclosed">
              <TabList>
                <Tab>Deposit</Tab>
                <Tab>Withdraw</Tab>
                <Tab>Claim</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Input
                    placeholder="Enter deposit amount"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    mb="4"
                  />
                  <Button onClick={handleDeposit}>Deposit</Button>
                </TabPanel>
                <TabPanel>
                  <Input
                    placeholder="Enter withdraw amount"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    mb="4"
                  />
                  <Button onClick={handleWithdraw}>Withdraw</Button>
                </TabPanel>
                <TabPanel>
                  <Button onClick={handleClaim}>Claim</Button>
                </TabPanel>
              </TabPanels>
            </Tabs>

            <Text className="paragraph1" style={{ color: 'white', padding: '20px', textAlign: 'center' }}>
              &copy; Lastmans DeFi Derby 2023. All rights reserved.
            </Text>
          </Container>
        </div>
      </div>
    </>
  );
}

export default App;
