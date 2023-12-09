import React, { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import { useAccount, useContractWrite } from 'wagmi';
import stakingABI from './stakingABI.json';
import './styles.css';

import backgroundGif from './horse.gif';
import HausLogo1 from './logo.png';
import MainTextLogo from './headerlogo.png';
import {
  Box,
  Link,
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

function App() {

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
                  <Tab>Race 1</Tab>
                  <Tab>Race 2</Tab>
                  <Tab>Race 3</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>

                  </TabPanel>
                  <TabPanel>

                  </TabPanel>
                  <TabPanel>

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




            //
