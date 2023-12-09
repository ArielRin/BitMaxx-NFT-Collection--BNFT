import React, { useEffect, useState } from 'react';
import { Button, Container, Text, Box, Link } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import { useAccount, useContractWrite } from 'wagmi';
import stakingABI from './stakingABI.json';
import './styles.css';

import backgroundGif from './horse.gif';
import HausLogo1 from './logo.png';
import MainTextLogo from './headerlogo.png';

const STAKING_CONTRACT_ADDRESS = '0x18ed09d95dc7e670eb917de97127445cd7832ed6';

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
