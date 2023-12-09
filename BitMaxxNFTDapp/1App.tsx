// App.js

import React, { useEffect, useState } from 'react';
import { Button, Container, Text, Box, Link } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import { useAccount, useContractWrite, useContractRead } from 'wagmi';
import abiFile from './abiFile.json';
import './styles.css'; // Reference to the external CSS file

import backgroundGif from './nebulosa.jpg';
import SafuLogo1 from './logo.png'; // Import your image file

// const CONTRACT_ADDRESS = '0xfA0644C86D8bC887496ea2A53aB470f6E85A0f27'; // test address 1 pwr ea
const CONTRACT_ADDRESS = '0x3121ff90D86128b0dCd2524469f0Aa3E1D5FdB63'; // final address 2500 pwr ea LIVE
const getExplorerLink = () => `https://scan.maxxchain.org/token/${CONTRACT_ADDRESS}`;
const getOpenSeaURL = () => `https://testnets.opensea.io/assets/goerli/${CONTRACT_ADDRESS}`;

function App() {
  const contractConfig = {
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: abiFile,
  };



  const [imgURL, setImgURL] = useState('');
  const { writeAsync: mint, error: mintError } = useContractWrite({
    ...contractConfig,
    functionName: 'mint',
  });
  const [mintLoading, setMintLoading] = useState(false);
  const { address } = useAccount();
  const isConnected = !!address;
  const [mintedTokenId, setMintedTokenId] = useState(null);
  const [mintAmount, setMintQuantity] = useState(1);

  const calculateTotalPrice = () => {
    const pricePerToken = 2500; // Adjust the price per token as needed
    return ethers.utils.parseEther((mintAmount * pricePerToken).toString());
  };

  const handleIncrement = () => {
    setMintQuantity((prevQuantity) => Math.min(prevQuantity + 1, 5));
  };

  const handleDecrement = () => {
    setMintQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  };

  const onMintClick = async () => {
    try {
      setMintLoading(true);
      const totalPrice = calculateTotalPrice();

      const tx = await mint({
        args: [mintAmount, { value: totalPrice }],
      });

      await tx.wait(); // Wait for the transaction to be mined

    } catch (error) {
      console.error(error);
    } finally {
      setMintLoading(false);
    }
  };

            //add to Line 175 <Box marginTop='4' display='flex' alignItems='center' justifyContent='center'>
            //   <Button
            //     marginTop='1'
            //     textColor='white'
            //     bg='blue.500'
            //     _hover={{
            //       bg: 'blue.700',
            //     }}
            //     onClick={handleDecrement}
            //     disabled={!isConnected || mintLoading || mintAmount === 1}
            //   >
            //     -
            //   </Button>
            //   <Text marginX='3' textAlign='center' fontSize='lg'>
            //     {mintAmount}
            //   </Text>
            //   <Button
            //     marginTop='1'
            //     textColor='white'
            //     bg='blue.500'
            //     _hover={{
            //       bg: 'blue.700',
            //     }}
            //     onClick={handleIncrement}
            //     disabled={!isConnected || mintLoading || mintAmount === 5}
            //   >
            //     +
            //   </Button>
            // </Box>
            //
            //
            //
            // <Box marginTop='2' display='flex' alignItems='center' justifyContent='center'>
            //   <Button
            //     disabled={!isConnected || mintLoading}
            //     marginTop='6'
            //     onClick={onMintClick}
            //     textColor='white'
            //     bg='blue.500'
            //     _hover={{
            //       bg: 'blue.700',
            //     }}
            //   >
            //     {isConnected ? `Mint ${mintAmount} Now` : ' Mint on (Connect Wallet)'}
            //   </Button>
            // </Box>


  return (
    <>

    <header>
    <Text className="header-text">BitMaxx NFT Collection Reward NFT</Text>
    <div className="connect-button">
      <ConnectButton />
    </div>
  </header>


  <div className="wrapper" style={{
    backgroundColor: 'black',
    color: 'white',
    backgroundImage: `url(${backgroundGif})`,
    backgroundSize: 'cover',
        }}>
        <div className="mainboxwrapper" >

        <Container className="container" paddingY="4">
          <div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src={SafuLogo1} alt="SaffuMaxx Logo" style={{ width: '18%', height: 'auto' }} />
          </div>

                                <Text className="ttitle" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
                                  BitMaxx NFT Collection Reward NFT
                                </Text>
            <Text className="paragraph1" style={{ textAlign: 'center', fontWeight: 'bold' }}>
              BitMaxx NFT Collection Reward NFTs , each priced at 2500 PWR. These non-fungible tokens offer a distinctive opportunity for collectors to own a piece of the BitMaxx NFT Collection legacy.
            </Text>
            <Text className="paragraph1" style={{ textAlign: 'center', fontWeight: 'bold' }}>
              The collection boasts one legendary NFT, adding an element of exclusivity and rarity to the series.
            </Text>
              <Text className="paragraph1" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                With only a limited quantity available, each BitMaxx NFT Collection Reward NFT becomes a coveted digital treasure, backed by the blockchain technology that ensures authenticity and scarcity.
              </Text>

            <Text className="contractaddr" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
              <Link
                isExternal
                href={getExplorerLink()}
              >
                {CONTRACT_ADDRESS}
              </Link>
            </Text>
          </div>

          <Text className="supplynft" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
             Minted 200 / 200 SOLD OUT!
          </Text>

                      <Text className="pricecost" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
                        2,500 PWR
                      </Text>
                      <Text className="contractaddr" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                        max 5 per transaction, no limit on quantity
                      </Text>









          {mintError && (
            <Text marginTop='4'>⛔️ Mint unsuccessful! Error message:</Text>
          )}
          {mintError && (
            <pre style={{ marginTop: '8px', color: 'red' }}>
              <code>{JSON.stringify(mintError, null, ' ')}</code>
            </pre>
          )}
          {mintLoading && <Text marginTop='2'>Minting... please wait</Text>}
          {mintedTokenId && (
            <Text marginTop='2'>
              Mint successful! You can view your NFT{' '}
              <Link
                isExternal
                href={getOpenSeaURL()}
                color='blue'
                textDecoration='underline'
              >
                Soon!
              </Link>
            </Text>
          )}
            <Text className="paragraph1" style={{ color: 'white', padding: '20px', textAlign: 'center' }}>
              &copy; 2023 BitMaxx NFT Collection. All rights reserved.
            </Text>
        </Container>
      </div>
      </div>
    </>
  );
}

export default App;
