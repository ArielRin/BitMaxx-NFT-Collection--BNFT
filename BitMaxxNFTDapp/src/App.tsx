import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Link,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  useToast,
  Button,
} from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import AnunakiNFTRewardsStaking from './AnunakiNFTRewardsStaking.json'; // Replace with the correct path
import abiFile from './abiFile.json';
import './styles.css';
import backgroundGif from './gold.gif';
import HausLogo1 from './logo.png';
import MainTextLogo from './headerlogo.png';

const CONTRACT_ADDRESS = '0xeaD4A1507C4cEE75fc3691FA57b7f2774753482C';
const getExplorerLink = () => `https://bscscan.com/token/${CONTRACT_ADDRESS}`;
const getOpenSeaURL = () => `https://testnets.opensea.io/assets/goerli/${CONTRACT_ADDRESS}`;

function App() {
  const account = useAccount();
  const [contractName, setContractName] = useState('');
  const [totalSupply, setTotalSupply] = useState(0);
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  const contractConfig = {
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: abiFile,
  };

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
    const pricePerToken = 0.001;
    return ethers.utils.parseEther((mintAmount * pricePerToken).toString());
  };

  const handleIncrement = () => {
    setMintQuantity((prevQuantity) => Math.min(prevQuantity + 1, 200));
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

      await tx.wait();
    } catch (error) {
      console.error('Error minting:', error);

      toast({
        title: 'Error',
        description: 'Minting failed. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setMintLoading(false);
    }
  };

  useEffect(() => {
    async function fetchContractData() {
      try {
        const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abiFile, provider);
        const name = await contract.name();
        const supply = await contract.totalSupply();
        setContractName(name);
        setTotalSupply(supply.toNumber());
      } catch (error) {
        console.error('Error fetching contract data:', error);

        toast({
          title: 'Error',
          description: 'Failed to fetch contract data. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchContractData();
  }, [toast]);

  const maxSupply = 200;
  const remainingSupply = maxSupply - totalSupply;

  return (
    <>
      <header>
        <img src={MainTextLogo} alt="Logo" className="logo" />
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
          backgroundSize: 'cover',
        }}
      >
        <div className="mainboxwrapper">
          <Container className="container" paddingY="4">
            <Tabs isFitted variant="enclosed">
              <TabList>
                <Tab>BitMaxx NFT</Tab>
                <Tab>About</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <div>
                    <img src={MainTextLogo} alt="BitMaxx DeFi" className="logobody" />
                    <Text className="paragraph1" style={{ textAlign: 'center', fontWeight: 'bold' }}></Text>
                    <Text
                      className="totalSupply"
                      style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}
                    >
                      {loading ? 'Loading...' : `Sold : ${totalSupply} / ${maxSupply}  `}
                    </Text>
                    <Text
                      className="remainingSupply"
                      style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}
                    >
                      {loading ? 'Loading...' : `Remaining Supply: ${remainingSupply}`}
                    </Text>
                    <Text
                      className="contractaddr"
                      style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}
                    >
                      <Link isExternal href={getExplorerLink()}>
                        {CONTRACT_ADDRESS}
                      </Link>
                    </Text>
                  </div>

                  <Text className="pricecost" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
                    5000 PWR Each!
                  </Text>
                  <Box marginTop="4" display="flex" alignItems="center" justifyContent="center">
                    <Button
                      marginTop="1"
                      textColor="white"
                      bg="#c0a219"
                      _hover={{
                        bg: '#ffce39',
                      }}
                      onClick={handleDecrement}
                      disabled={!isConnected || mintLoading || mintAmount === 1}
                    >
                      -
                    </Button>
                    <Text marginX="3" textAlign="center" fontSize="lg">
                      {mintAmount}
                    </Text>
                    <Button
                      marginTop="1"
                      textColor="white"
                      bg="#c0a219"
                      _hover={{
                        bg: '#ffce39',
                      }}
                      onClick={handleIncrement}
                      disabled={!isConnected || mintLoading || mintAmount === 60}
                    >
                      +
                    </Button>
                  </Box>

                  <Box marginTop="2" display="flex" alignItems="center" justifyContent="center">
                    <Button
                      disabled={!isConnected || mintLoading}
                      marginTop="6"
                      onClick={onMintClick}
                      textColor="white"
                      bg="#c0a219"
                      _hover={{
                        bg: '#ffce39',
                      }}
                    >
                      {isConnected ? `Mint ${mintAmount} Now` : ' Mint on (Connect Wallet)'}
                    </Button>
                  </Box>
                  {mintError && <Text marginTop="4">⛔️ Mint unsuccessful! Error message:</Text>}
                  {mintError && (
                    <pre style={{ marginTop: '8px', color: 'red' }}>
                      <code>{JSON.stringify(mintError, null, ' ')}</code>
                    </pre>
                  )}
                  {mintLoading && <Text marginTop="2">Minting... please wait</Text>}
                  {mintedTokenId && (
                    <Text marginTop="2">
                      Mint successful! You can view your NFT{' '}
                      <Link
                        isExternal
                        href={getOpenSeaURL()}
                        color="#ffce39"
                        textDecoration="underline"
                      >
                        Soon!
                      </Link>
                    </Text>
                  )}
                </TabPanel>
                <TabPanel>
                  <Container></Container>
                </TabPanel>
              </TabPanels>
            </Tabs>
            <Text className="paragraph1" style={{ color: 'white', padding: '20px', textAlign: 'center' }}>
              &copy; BitMaxx DeFi Platform 2023. On MaxxChain. All rights reserved.
            </Text>
          </Container>
        </div>
      </div>
    </>
  );
}

export default App;
