import React, { useEffect, useState } from 'react';
import { Button, Container, Text, Box, Link } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import abiFile from './abiFile.json';
import backgroundGif from './bg.jpg';
import HausLogo1 from './logo.png';

const CONTRACT_ADDRESS = '0x1b7C6855d2f65ec78828fCa07cC9170088E1815c'; // final address 2500 pwr ea LIVE
const getExplorerLink = () => `https://scan.maxxchain.org/token/${CONTRACT_ADDRESS}`;

function App() {
  const account = useAccount();
  const [contractName, setContractName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContractData() {
      try {
        // Connect to the Ethereum network (replace with your provider details)
        const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');

        // Instantiate the contract
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abiFile, provider);

        // Call the 'name' method on the contract
        const name = await contract.name();

        // Update the state with the contract name
        setContractName(name);
      } catch (error) {
        console.error('Error fetching contract data:', error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    }

    fetchContractData();
  }, []); // Empty dependency array to run the effect only once

  return (
    <>
      <header>
        <img src={HausLogo1} alt="BitMaxx NFT Collection 2023 Logo" style={{ width: '2%', height: 'auto' }} />
        <Text className="header-text">BitMaxx NFT Collection 2023</Text>
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
        <div className="mainboxwrapper">
          <Container className="container" paddingY="4">
            <div>
              <Text className="ttitle" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
                BitMaxx NFT Collection
              </Text>
              <Text className="paragraph1" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                Add my Description here once u think of what ya bloody making here to test
              </Text>
              <Text className="contractname" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                {loading ? 'Loading...' : `Contract Name: ${contractName || 'N/A'}`}
              </Text>
              <Text className="contractaddr" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                <Link isExternal href={getExplorerLink()}>
                  {CONTRACT_ADDRESS}
                </Link>
              </Text>
            </div>
          </Container>
        </div>
      </div>
    </>
  );
}

export default App;
