import React, { useEffect, useState } from 'react';
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

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import { useAccount, useContractWrite } from 'wagmi';
import abiFile from './abiFile.json';
import './styles.css'; // Reference to the external CSS file

import backgroundGif from './horse.gif';
import HausLogo1 from './logo.png'; // Import your image file
import MainTextLogo from './headerlogo.png'; // Import your image file


const CONTRACT_ADDRESS = '0x172499980D37E6590b1bB7BFA0b51C64Dd34f84b'; // final address 2500 pwr ea LIVE
const getExplorerLink = () => `https://bscscan.com/token/${CONTRACT_ADDRESS}`;
const getOpenSeaURL = () => `https://testnets.opensea.io/assets/goerli/${CONTRACT_ADDRESS}`;

function App() {
  const account = useAccount();
  const [contractName, setContractName] = useState('');
  const [totalSupply, setTotalSupply] = useState(0); // Added state for totalSupply
  const [loading, setLoading] = useState(true);

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
        const pricePerToken = 0.1; // Adjust the price per token as needed
        return ethers.utils.parseEther((mintAmount * pricePerToken).toString());
      };

      const handleIncrement = () => {
        setMintQuantity((prevQuantity) => Math.min(prevQuantity + 1, 80));
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



























  useEffect(() => {
    async function fetchContractData() {
      try {
        // Connect to the Ethereum network (replace with your provider details)
        const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');

        // Instantiate the contract
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abiFile, provider);

        // Call the 'name' method on the contract
        const name = await contract.name();

        // Call the 'totalSupply' method on the contract
        const supply = await contract.totalSupply();

        // Update the state with the contract name and totalSupply
        setContractName(name);
        setTotalSupply(supply.toNumber());
      } catch (error) {
        console.error('Error fetching contract data:', error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    }

    fetchContractData();
  }, []); // Empty dependency array to run the effect only once

  const maxSupply = 100;
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
                <Tab>LastMan NFT</Tab>
                <Tab>Missions NFT</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>


                <div>

                      <img src={MainTextLogo} alt="Lastman DeFi" className="logobody" />
                  <Text className="paragraph1" style={{ textAlign: 'center', fontWeight: 'bold' }}>

          LastManHolding NFT will reward a random existing holder with 10% of the purchase price of last NFT sold.
          Every NFT purchased will reward a current holder randomly until there is only one left. The last NFT sold will earn a total
          of 10% (1.5BNB) of the entire treasury, total value of all the NFTS sold.
          Pricing is currently at base cost of 0.15BNB. Get in early to have more chances to be rewarded and remember!
          You can always have more than one, which means
          more chances for rewards. 1 Lastman NFT per transaction with no cap on qty per wallet. Enjoy the Ride!!
                  </Text>
                  <Text className="contractname" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                    {loading ? 'Loading...' : `Contract Name: ${contractName || 'N/A'}`}
                  </Text>
                  <Text className="totalSupply" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                    {loading ? 'Loading...' : `Sold : ${totalSupply} / ${maxSupply}  `}
                  </Text>
                  <Text className="remainingSupply" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                    {loading ? 'Loading...' : `Remaining Supply: ${remainingSupply}`}
                  </Text>
                  <Text className="contractaddr" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                    <Link isExternal href={getExplorerLink()}>
                      {CONTRACT_ADDRESS}
                    </Link>
                  </Text>
                </div>

                  <Text className="pricecost" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
                    Price reduced from 0.15BNB
                  </Text>

                  <Text className="pricecost" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
                    Now only 0.1 BNB Each
                  </Text>
                <Box marginTop='4' display='flex' alignItems='center' justifyContent='center'>
                  <Button
                    marginTop='1'
                    textColor='white'
                    bg='#0c5cb6'
                    _hover={{
                      bg: '#64c6ff',
                    }}
                    onClick={handleDecrement}
                    disabled={!isConnected || mintLoading || mintAmount === 1}
                  >
                    -
                  </Button>
                  <Text marginX='3' textAlign='center' fontSize='lg'>
                    {mintAmount}
                  </Text>
                  <Button
                    marginTop='1'
                    textColor='white'
                    bg='#0c5cb6'
                    _hover={{
                      bg: '#64c6ff',
                    }}
                    onClick={handleIncrement}
                    disabled={!isConnected || mintLoading || mintAmount === 60}
                  >
                    +
                  </Button>
                </Box>



                <Box marginTop='2' display='flex' alignItems='center' justifyContent='center'>
                  <Button
                    disabled={!isConnected || mintLoading}
                    marginTop='6'
                    onClick={onMintClick}
                    textColor='white'
                    bg='#0c5cb6'
                    _hover={{
                      bg: '#64c6ff',
                    }}
                  >
                    {isConnected ? `Mint ${mintAmount} Now` : ' Mint on (Connect Wallet)'}
                  </Button>
                </Box>
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
                      color='#64c6ff'
                      textDecoration='underline'
                    >
                      Soon!
                    </Link>
                  </Text>
                )}

                </TabPanel>
                <TabPanel>

                </TabPanel>
                <TabPanel>

                </TabPanel>
                <TabPanel>

                </TabPanel>
              </TabPanels>
            </Tabs>
              <Text className="paragraph1" style={{ color: 'white', padding: '20px', textAlign: 'center' }}>
                &copy; Lastman DeFi Platform 2023. All rights reserved.
              </Text>
          </Container>


        </div>
      </div>
    </>
  );
}

export default App;
