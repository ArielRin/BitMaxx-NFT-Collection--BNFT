import React, { useEffect, useState } from 'react';
import { Button, Container, Text, Box, Link } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import { useAccount, useContractWrite } from 'wagmi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import abiFile from './abiFile.json';
import './styles.css';
import backgroundGif from './gold.gif';
import MainTextLogo from './headerlogo.png';

const CONTRACT_ADDRESS = '0xeaD4A1507C4cEE75fc3691FA57b7f2774753482C';

const getExplorerLink = () => `https://scan.maxxchain.org/address/${CONTRACT_ADDRESS}`;
const getOpenSeaURL = () => `https://testnets.opensea.io/assets/goerli/${CONTRACT_ADDRESS}`;

function App() {
  const account = useAccount();
  const [contractName, setContractName] = useState('');
  const [totalSupply, setTotalSupply] = useState(0);
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
    const pricePerToken = 0.0018008135;
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
      toast.success('Mint successful! You can view your NFT soon.');
    } catch (error) {
      console.error(error);
      toast.error('Mint unsuccessful! Please try again.');
    } finally {
      setMintLoading(false);
    }
  };

  useEffect(() => {
    async function fetchContractData() {
      try {
        const provider = new ethers.providers.JsonRpcProvider('https://mainrpc4.maxxchain.org/');
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abiFile, provider);
        const name = await contract.name();
        const supply = await contract.totalSupply();
        setContractName(name);
        setTotalSupply(supply.toNumber());
      } catch (error) {
        console.error('Error fetching contract data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchContractData();
  }, []);

  const maxSupply = 200;
  const remainingSupply = maxSupply - totalSupply;

  return (
    <>
      <ToastContainer />

      <header>
        <img src={MainTextLogo} alt="BitMaxx NFT Collection" className="logobodyhead" />
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
            <div>
              <img src={MainTextLogo} alt="BitMaxx NFT Collection" className="logobody" />
              <Text className="contractname" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                {loading ? 'Loading...' : `${contractName || 'N/A'}`}
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
              5000 PWR Each!
            </Text>
            <Box marginTop='4' display='flex' alignItems='center' justifyContent='center'>
              <Button
                marginTop='1'
                textColor='white'
                bg='#ffc114'
                _hover={{
                  bg: '#ffdc39',
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
                bg='#ffc114'
                _hover={{
                  bg: '#ffdc39',
                }}
                onClick={handleIncrement}
                disabled={!isConnected || mintLoading || mintAmount === 200}
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
                bg='#ffc114'
                _hover={{
                  bg: '#ffdc39',
                }}
              >
                {isConnected ? `Mint ${mintAmount} Now` : ' Mint on (Connect Wallet)'}
              </Button>
            </Box>
            <Text className="paragraph1" style={{ color: 'white', padding: '20px', textAlign: 'center' }}>
              &copy; BitMaxx NFT Collection 2023. All rights reserved.
            </Text>
          </Container>
        </div>
      </div>
    </>
  );
}

export default App;
