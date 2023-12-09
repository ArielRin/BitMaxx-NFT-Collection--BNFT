import React, { useEffect, useState } from 'react';

import {
  Box,
  Link,
  Container,
  Tabs,
  TabList,
  TabPanels,
  Spacer,
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import abiFile from './abiFile.json';
import './styles.css';
import backgroundGif from './gold.gif';
import MainTextLogo from './headerlogo.png';

const CONTRACT_ADDRESS = '0x0e644A552B34A8F1e276bc91ADA11e25411aEF44'; // 2nd maxxtest
// const CONTRACT_ADDRESS = '0x27B327315cb8EFBD671FDf82730a3bD25563aea5'; // first maxx test 2
// const CONTRACT_ADDRESS = '0xeaD4A1507C4cEE75fc3691FA57b7f2774753482C'; // first maxx test 1

const getExplorerLink = () => `https://scan.maxxchain.org/address/${CONTRACT_ADDRESS}`;
const getOpenSeaURL = () => `https://testnets.opensea.io/assets/goerli/${CONTRACT_ADDRESS}`;

function App() {
  const account = useAccount();
    console.log('Connected wallet address:', account);

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

  const [newCost, setNewCost] = useState('');

  const { writeAsync: pauseContract, error: pauseError } = useContractWrite({
    ...contractConfig,
    functionName: 'pause',
  });


    const calculateTotalPrice = () => {
      const pricePerToken = parseFloat(cost);
      return ethers.utils.parseEther((mintAmount * pricePerToken).toString());
    };


    const maxSupply = 200;
    const remainingSupply = maxSupply - totalSupply;


  const { writeAsync: setNewCostFn, error: setNewCostError } = useContractWrite({
  ...contractConfig,
  functionName: 'setCost',
});

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

      // Call the mint function in the contract
      const tx = await mint({
        args: [mintAmount, { value: totalPrice }],
      });

      await tx.wait();
      toast.success('Mint successful! You can view your NFT soon.');

      // Update totalSupply after a successful mint
      setTotalSupply((prevTotalSupply) => prevTotalSupply + mintAmount);

      // Update contract balance after successful mint
      const provider = new ethers.providers.JsonRpcProvider('https://mainrpc4.maxxchain.org/');
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abiFile, provider);
      const balance = await contract.getContractBalance();
      setContractBalanceValue(parseFloat(ethers.utils.formatEther(balance)));
    } catch (error) {
      console.error(error);
      toast.error('Mint unsuccessful! Please try again.');
    } finally {
      setMintLoading(false);
    }
  };





const onSetCostClick = async () => {
  try {
    // Convert the new cost value to Wei
    const newCostValueInWei = ethers.utils.parseUnits(newCost.toString(), 'wei');

    // Call the setCost function in the contract
    const tx = await setNewCostFn({
      args: [newCostValueInWei],
    });

    await tx.wait();
    toast.success('Cost updated successfully!');

    // Update the cost state after a successful setCost operation
    setCost(newCost.toString());
  } catch (error) {
    console.error(error);
    toast.error('Failed to update cost. Please try again.');
  }
};


  const onTogglePauseClick = async () => {
  try {
    // Toggle the pause state
    const newState = !isPaused;

    // Call the pause function in the contract
    const tx = await pauseContract({
      args: [newState],
    });

    await tx.wait();
    toast.success(`Contract is now ${newState ? 'paused' : 'resumed'}`);

    // Update isPaused state after a successful pause/unpause
    setIsPaused(newState);
  } catch (error) {
    console.error(error);
    toast.error('Failed to toggle pause state. Please try again.');
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
        setTotalSupply(supply.toNumber());// Fetch the user's balance
      if (account) {
        const userBalanceResult = await contract.balanceOf(account);
        setUserBalance(userBalanceResult.toNumber());
      }
    } catch (error) {
      console.error('Error fetching contract data:', error);
    } finally {
      setLoading(false);
    }
  }

  fetchContractData();
}, [account]);




const [cost, setCost] = useState('0');

useEffect(() => {
  async function fetchCost() {
    try {
      const provider = new ethers.providers.JsonRpcProvider('https://mainrpc4.maxxchain.org/');
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abiFile, provider);

      // Read the cost value directly from the contract
      const costValue = await contract.cost();

      // Convert Wei to Ether and set the state
      setCost(ethers.utils.formatEther(costValue));
    } catch (error) {
      console.error('Error fetching cost:', error);
    }
  }

  fetchCost();
}, []);

const [isPaused, setIsPaused] = useState(false);

useEffect(() => {
  async function fetchPauseStatus() {
    try {
      const provider = new ethers.providers.JsonRpcProvider('https://mainrpc4.maxxchain.org/');
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abiFile, provider);

      // Read the paused status directly from the contract
      const pausedStatus = await contract.paused();

      setIsPaused(pausedStatus);
    } catch (error) {
      console.error('Error fetching paused status:', error);
    }
  }

  fetchPauseStatus();
}, []);



const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    async function fetchRevealStatus() {
      try {
        const provider = new ethers.providers.JsonRpcProvider('https://mainrpc4.maxxchain.org/');
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abiFile, provider);

        // Read the revealed status directly from the contract
        const revealedStatus = await contract.revealed();

        setIsRevealed(revealedStatus);
      } catch (error) {
        console.error('Error fetching revealed status:', error);
      }
    }

    fetchRevealStatus();
  }, []);



  const { writeAsync: withdrawFunds, error: withdrawError } = useContractWrite({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: abiFile,
    functionName: 'withdraw',
  });

  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const onWithdrawClick = async () => {
    try {
      setWithdrawLoading(true);

      // Call the withdraw function in the contract
      const tx = await withdrawFunds();

      await tx.wait();
      toast.success('Funds withdrawn successfully!');

      // Update contract balance after successful withdrawal
      const provider = new ethers.providers.JsonRpcProvider('https://mainrpc4.maxxchain.org/');
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abiFile, provider);
      const balance = await contract.getContractBalance();
      setContractBalanceValue(parseFloat(ethers.utils.formatEther(balance)));
    } catch (error) {
      console.error(error);
      toast.error('Failed to withdraw funds. Please try again.');
    } finally {
      setWithdrawLoading(false);
    }
  };



  const { writeAsync: revealCollection, error: revealError } = useContractWrite({
    ...contractConfig,
    functionName: 'reveal',
  });

  const onRevealClick = async () => {
    try {
      // Check if the collection is already revealed
      if (isRevealed) {
        toast.info('Collection is already revealed!');
        return;
      }

      // Call the reveal function in the contract
      const tx = await revealCollection();

      await tx.wait();
      toast.success('Collection revealed successfully!');
      setIsRevealed(true); // Update the local state to reflect that the collection is revealed
    } catch (error) {
      console.error(error);
      toast.error('Failed to reveal collection. Please try again.');
    }
  };

  const [contractBalanceValue, setContractBalanceValue] = useState(0);

  useEffect(() => {
    async function fetchContractBalance() {
      try {
        const provider = new ethers.providers.JsonRpcProvider('https://mainrpc4.maxxchain.org/');
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abiFile, provider);

        // Read the contract balance directly from the contract
        const balance = await contract.getContractBalance();

        // Convert Wei to Ether and set the state
setContractBalanceValue(parseFloat(ethers.utils.formatEther(balance)));      } catch (error) {
        console.error('Error fetching contract balance:', error);
      }
    }

    fetchContractBalance();
  }, []);

  const [userBalance, setUserBalance] = useState(0);

const [userNftBalance, setUserNftBalance] = useState(0);

useEffect(() => {
  async function fetchUserNftBalance() {
    try {
      // Extract the Ethereum address from the account object
      const userAddress = account.address;

      if (userAddress && ethers.utils.isAddress(userAddress)) {
        const provider = new ethers.providers.JsonRpcProvider('https://mainrpc4.maxxchain.org/');
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abiFile, provider);

        // Call the balanceOf function to get the user's NFT balance
        const userBalanceResult = await contract.balanceOf(userAddress);
        setUserNftBalance(userBalanceResult.toNumber());
      } else {
        // Handle the case where the extracted address is not a valid address
        console.error('Invalid or undefined Ethereum address:', userAddress);
      }
    } catch (error) {
      console.error('Error fetching user NFT balance:', error);
    }
  }

  // Fetch user's NFT balance only if the account is valid
  if (account && account.address) {
    fetchUserNftBalance();
  }
}, [account]);


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
          <Tabs isFitted variant="enclosed">
            <TabList>
              <Tab style={{ fontWeight: 'bold', color: 'white' }}>Home</Tab>
              <Tab style={{ fontWeight: 'bold', color: 'white' }}>Mint</Tab>
              <Tab style={{ fontWeight: 'bold', color: 'white' }}>Stats</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>

              <div>
                <img src={MainTextLogo} alt="BitMaxx NFT Collection" className="logobody" />

                <Text className="pricecost" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
                  BitMaxx About our NFTs
                </Text>

                <Text className="paragraph1" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
                Welcome to the BitMaxx NFT Collection! This collection is built on the MaxxChain network, bringing you a seamless and secure NFT experience. Each NFT in this collection is priced at 5000 PWR, making it an exclusive addition to your digital assets.
                </Text>





                <Text className="pauseStatus" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: isPaused ? 'red' : 'green' }}>
                  {isPaused ? 'NFT Minting currently Paused' : 'NFT Minting is Open!'}
                </Text>
              </div>




              </TabPanel>
              <TabPanel>
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
    <Text className="userNftBalance" style={{ textAlign: 'center', fontWeight: 'bold' }}>
      {loading ? 'Loading...' : `BitMaxx NFTs in wallet : ${userNftBalance} `}
    </Text>
  </div>

  {totalSupply === maxSupply ? (
    <Text className="soldOutMessage" style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '3xl', color: 'red' }}>
      Sold Out!
    </Text>
  ) : (
    <>
      <Text className="pricecost" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
        {cost} PWR Each!
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
    </>
  )}
</TabPanel>

              <TabPanel>



              <div>
                <img src={MainTextLogo} alt="BitMaxx NFT Collection" className="logobody" />


                <Text className="contractaddr" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>

                    {CONTRACT_ADDRESS}

                </Text>


                <Text className="paragraph1" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                  {loading ? 'Loading...' : `Remaining Supply: ${remainingSupply}`}
                </Text>
                <Text className="paragraph1" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                  {loading ? 'Loading...' : `NFT Price: ${cost} PWR`}
                </Text>

                <Text className="paragraph1" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                  {loading ? 'Loading...' : `Contract Balance: ${contractBalanceValue} PWR`}
                </Text>

                <Text className="pricecost" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
                  Admin Functions
                </Text>

                <div className="buttons-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                  <Button
                    onClick={onRevealClick}
                    textColor="white"
                    bg={isRevealed ? '#666' : '#ff5555'}
                    _hover={{
                      bg: isRevealed ? '#666' : '#ff6b6b',
                    }}
                    style={{ marginRight: '1rem' }}
                    >
                    {isRevealed ? 'Already Revealed' : 'Reveal Collection (Only Owner)'}
                  </Button>

                  <Button
                    onClick={onTogglePauseClick}
                      textColor="white"
                      bg="#ff5555"
                      _hover={{
                        bg: '#ff6b6b',
                      }}
                      >
                      {isPaused ? 'UnPause Minting ' : 'Pause Minting'}
                  </Button>
              </div>
              <Text
                className="revealedStatus"
                style={{
                  padding: '10px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: isRevealed ? 'green' : 'orange',
                    }}
                    >
                {isRevealed ? 'NFT has been Revealed' : 'NFT is yet to be Revealed. Stay Tuned!'}
              </Text>
              <Text className="pauseStatus" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: isPaused ? 'red' : 'green' }}>
                {isPaused ? 'NFT Minting currently Paused' : 'NFT Minting is Open!'}
              </Text>

              <Box marginTop='2' display='flex' alignItems='center' justifyContent='center'>
                <Input
                 type="number"
                 placeholder=" Enter new price in Wei (Only Owner)"
                 value={newCost}
                 onChange={(e) => setNewCost(e.target.value)}
                 marginBottom="0"
                 />
                <Button
                 onClick={onSetCostClick}
                 textColor="white"
                 bg="#ff5555"
                 _hover={{
                   bg: '#ff6b6b',
                 }}
                 >
                 Set Cost
                 </Button>

               </Box>
                             <Box marginTop='2' display='flex' alignItems='center' justifyContent='center'>
               <Button
                                       onClick={onWithdrawClick}
                                       textColor="white"
                                       bg="#ff5555"
                                       _hover={{
                                         bg: '#ff6b6b',
                                       }}
                                     >
                                       {withdrawLoading ? 'Withdrawing...' : 'Withdraw Funds (Only Owner)'}
                                     </Button>

                                                    </Box>
              </div>





              </TabPanel>
            </TabPanels>
          </Tabs>
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




                //
                // <Text className="paragraph1" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                //   {loading ? 'Loading...' : `Contract Balance: ${ethers.utils.formatEther(contractBalance)} PWR`}
                // </Text>
