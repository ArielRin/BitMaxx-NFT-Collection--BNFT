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

import { FaTelegram, FaTwitter, FaGlobe, FaGithub } from 'react-icons/fa'; // Import the icons you want to use

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import { useAccount, useContractWrite } from 'wagmi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import abiFile from './abiFile.json';
import splitterABI from './splitterABI.json';

import './styles.css';
import backgroundGif from './sea.gif';
import MainTextLogo from './headerlogo.png';

import yourVideo from 'https://github.com/ArielRin/BitMaxx-NFT-Collection--BNFT/raw/final/1yt.mp4';

import yourGif from './nft.gif';

import btm from './btm.png';
import btm3 from './btm2.png';


import btm2 from './nft.gif';

type Nft = {
    tokenId: number;
    // Add other properties if needed
};
//
// const SPLITTER_CONTRACT_ADDRESS = '0x4462b3D79f607B8F0DcdB7475E553333423ec740'; // cheyne test splitter

const SPLITTER_CONTRACT_ADDRESS = '0xf713Ee496D8bAc31E8f8AaC61b374C609982c94C'; // live

const CONTRACT_ADDRESS = '0xaA0015FbB55b0f9E3dF74e0827a63099e4201E38'; // 2nd maxxtest 0x0e644A552B34A8F1e276bc91ADA11e25411aEF44
// const CONTRACT_ADDRESS = '0x27B327315cb8EFBD671FDf82730a3bD25563aea5'; // first maxx test 2
// const CONTRACT_ADDRESS = '0xeaD4A1507C4cEE75fc3691FA57b7f2774753482C'; // first maxx test 1

const getExplorerLink = () => `https://scan.maxxchain.org/address/${CONTRACT_ADDRESS}`;
const getOpenSeaURL = () => `https://testnets.opensea.io/assets/goerli/${CONTRACT_ADDRESS}`;
const getSplitterScanLink = () => `https://scan.maxxchain.org/address/${SPLITTER_CONTRACT_ADDRESS}/contracts#address-tabs`;

// ###################################
// ###################################
// ###################################
// ###################################
// ###################################
// ###################################
// ###################################
// ###################################
// ###################################
// ###################################
// ###################################
// ###################################
function App() {


  const account = useAccount();
    console.log('Connected wallet address:', account);

  const [tabIndex, setTabIndex] = useState(0);

  const [contractName, setContractName] = useState('');
  const [totalSupply, setTotalSupply] = useState(0);
  const [loading, setLoading] = useState(true);

  const [userNfts, setUserNfts] = useState<Nft[]>([]); // Update the state declaration

  const [tokenBalance, setTokenBalance] = useState('0');
  const [totalDistributed, setTotalDistributed] = useState('0');

    const updateBalances = async () => {
      await fetchTokenBalance();
      await fetchTotalDistributed();
    };

    const openMintTab = () => {
      setTabIndex(1); // Assuming 'Mint' tab is at index 1
    };


const [holders, setHolders] = useState<string[]>([]);

const getSplitterContract = () => {
  const provider = new ethers.providers.JsonRpcProvider('https://rpc.maxxchain.org/');
  const contract = new ethers.Contract(SPLITTER_CONTRACT_ADDRESS, splitterABI, provider);
  return contract;
};

const getTokenLink = (tokenId: number) => {
  return `https://scan.maxxchain.org/token/${CONTRACT_ADDRESS}/instance/${tokenId}/metadata`;
};
// nft count



  const contractConfig = {
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: abiFile,
  };

  const splitterContractConfig = {
  addressOrName: SPLITTER_CONTRACT_ADDRESS,
  contractInterface: splitterABI,
};

//autopayee update
const parseHoldersString = (holdersStr: string) => {
  return holdersStr.replace('[', '').replace(']', '').split(',').map(addr => addr.trim().replace(/"/g, ''));
};

const { writeAsync: updatePayees, error: updatePayeesError } = useContractWrite({
  ...splitterContractConfig,
  functionName: 'updatePayees',
});


const handleUpdatePayees = async () => {
  try {
    const payeesArray = parseHoldersString(holdersString);
    await updatePayees({ args: [payeesArray] });
    toast.success('Payees updated successfully!');
  } catch (error) {
    console.error('Error updating payees:', error);
    toast.error('Failed to update payees. Please try again.');
  }
};

//autopayee update


const { writeAsync: distributeTokens, error: distributeError } = useContractWrite({
  ...splitterContractConfig,
  functionName: 'distribute',
});

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
      const provider = new ethers.providers.JsonRpcProvider('https://rpc.maxxchain.org/');
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
  updateBalances();

  // Set up an interval to periodically refresh the data
  const interval = setInterval(updateBalances, 30000); // Refresh every 30 seconds

  // Clean up the interval when the component unmounts
  return () => clearInterval(interval);
}, []);









  useEffect(() => {
    async function fetchContractData() {
      try {
        const provider = new ethers.providers.JsonRpcProvider('https://rpc.maxxchain.org/');
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
      const provider = new ethers.providers.JsonRpcProvider('https://rpc.maxxchain.org/');
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
      const provider = new ethers.providers.JsonRpcProvider('https://rpc.maxxchain.org/');
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
        const provider = new ethers.providers.JsonRpcProvider('https://rpc.maxxchain.org/');
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
      const provider = new ethers.providers.JsonRpcProvider('https://rpc.maxxchain.org/');
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
        const provider = new ethers.providers.JsonRpcProvider('https://rpc.maxxchain.org/');
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
        const provider = new ethers.providers.JsonRpcProvider('https://rpc.maxxchain.org/');
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


const fetchHolders = async () => {
  setLoading(true);
  try {
    const provider = new ethers.providers.JsonRpcProvider('https://rpc.maxxchain.org/');
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abiFile, provider);
    const totalSupply = await contract.totalSupply();

    let addresses = [];
    for (let i = 1; i <= totalSupply; i++) {
      const owner = await contract.ownerOf(i);
      addresses.push(`"${owner}"`); // Enclose each address in double quotes
    }

    setHolders(addresses);
  } catch (error) {
    console.error('Error fetching holders:', error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchHolders(); // Initial fetch
  const interval = setInterval(fetchHolders, 30000); // Refresh every 30 seconds

  return () => clearInterval(interval); // Cleanup interval on component unmount
}, []);

useEffect(() => {
  const fetchHolders = async () => {
    const provider = new ethers.providers.JsonRpcProvider('https://rpc.maxxchain.org/');
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abiFile, provider);
    const totalSupply = await contract.totalSupply();

    let addresses = [];
    for (let i = 1; i <= totalSupply; i++) {
      const owner = await contract.ownerOf(i);
      addresses.push(`"${owner}"`); // Enclose each address in double quotes
    }

    setHolders(addresses);
    setLoading(false);
  };

  fetchHolders();
}, []);

const holdersString = '[' + holders.join(", ") + ']';

// fetch token balance splitter below
const fetchTokenBalance = async () => {
  const contract = getSplitterContract();
  try {
    const balance = await contract.getTokenBalance();
    // Convert using the token's 5 decimal places
    const formattedBalance = ethers.utils.formatUnits(balance, 5);
    // Format the balance to display with 2 decimal places
    setTokenBalance(Number(formattedBalance).toFixed(2));
  } catch (error) {
    console.error('Error fetching token balance:', error);
    setTokenBalance('Error'); // Handle error appropriately
  }
};

const fetchTotalDistributed = async () => {
  const contract = getSplitterContract();
  try {
    const distributed = await contract.totalDistributed();
    // Convert using the token's 5 decimal places
    const formattedDistributed = ethers.utils.formatUnits(distributed, 5);
    // Format the amount to display with 2 decimal places
    setTotalDistributed(Number(formattedDistributed).toFixed(2));
  } catch (error) {
    console.error('Error fetching total distributed:', error);
    setTotalDistributed('Error'); // Handle error appropriately
  }
};


useEffect(() => {
  fetchTokenBalance();
  fetchTotalDistributed();
}, []);

//view NFT

const fetchUserNfts = async () => {
    if (!account || !account.address) return;

    try {
        const provider = new ethers.providers.JsonRpcProvider('https://rpc.maxxchain.org/');
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abiFile, provider);
        const balance = await contract.balanceOf(account.address);

        let nfts: Nft[] = [];
        for (let i = 0; i < balance; i++) {
            const tokenId = await contract.tokenOfOwnerByIndex(account.address, i);
            nfts.push({ tokenId: Number(tokenId) });
        }
        setUserNfts(nfts);
    } catch (error) {
        console.error('Error fetching user NFTs:', error);
        // Handle the error appropriately. For example, you might want to set an error state, show a message, etc.
    }
};


  // Fetch user NFTs when account changes
  useEffect(() => {
    fetchUserNfts();
  }, [account]);


  return (
    <>
      <ToastContainer />

      <header className="header">
          <img src={MainTextLogo} alt="BitMaxx NFT Collection" className="logobodyhead" />
        <div className="connect-button">
          <ConnectButton />
        </div>
      </header>

      <div className="main-content"  style={{
    backgroundColor: 'black',
    color: 'white',
    backgroundImage: `url(${backgroundGif})`,
    backgroundSize: 'cover',
}}>
        <div className="mainboxwrapper" >
          <Container className="container" paddingY="4">
          <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)} isFitted variant="enclosed">
            <TabList>
              <Tab style={{ fontWeight: 'bold', color: 'white' }}>Home</Tab>
              <Tab style={{ fontWeight: 'bold', color: 'white' }}>Mint</Tab>
              <Tab style={{ fontWeight: 'bold', color: 'white' }}>Stats</Tab>
              <Tab style={{ fontWeight: 'bold', color: 'white' }}>Admin</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>

              <div>

                  <img src={yourGif} alt="Your Gif" style={{ width: '100%', borderRadius: '30px' }} />


                <Text className="pricecost" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
                  BitMaxx  NFT Collection
                </Text>

                <Text className="paragraph1" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
                Welcome to the BitMaxx NFT Collection! This collection is built on the MaxxChain network, bringing you a seamless and secure NFT experience. Each NFT in this collection is priced at 5000 PWR, making it an exclusive addition to your digital assets.
                </Text>





                <Text className="pauseStatus" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: isPaused ? 'red' : 'green' }}>
                  {isPaused ? 'NFT Minting currently Paused' : 'NFT Minting is Open!'}
                </Text>
              </div>
              <Box marginTop='2' display='flex' alignItems='center' justifyContent='center'>
                <Button bg='#058ba1' textColor='white' onClick={openMintTab}>Open Minting Page</Button>
              </Box>




              <Text className="pricecost" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
               {totalDistributed} Safumaxx Already Rewarded to NFT Holders
              </Text>





              </TabPanel>
              <TabPanel>


                  <img src={btm} alt="BitMaxx NFT Collection" className="logobody" style={{ width: '50%', height: '50%' }} />



  <div>
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
          bg='#058ba1'
          _hover={{
            bg: '#4d9795',
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
          bg='#058ba1'
          _hover={{
            bg: '#4d9795',
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
          bg='#058ba1'
          _hover={{
            bg: '#4d9795',
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

                <img src={btm} alt="BitMaxx NFT Collection" className="logobody" style={{ width: '50%', height: '50%' }} />



                <Text className="paragraph1" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                  {loading ? 'Loading...' : `Remaining Supply: ${remainingSupply}`}
                </Text>
                <Text className="paragraph1" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                  {loading ? 'Loading...' : `NFT Price: ${cost} PWR`}
                </Text>

                <Text className="paragraph1" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                  {loading ? 'Loading...' : `Contract Balance: ${contractBalanceValue} PWR`}
                </Text>
                <Text className="pricecost" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                Total pending NFT Rewards: {tokenBalance} SafuMaxx
                </Text>

                  <Text className="setCost" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                   Total rewarded to holders: {totalDistributed} Safumaxx
                 </Text>

              </div>

              <div className="nftboxwrapper" >

              <Text className="pricecost" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
    BitMaxx Nfts in your Wallet
  </Text>

  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px', justifyContent: 'center' }}>
    {userNfts.map((nft) => (
      <div key={nft.tokenId.toString()} style={{ textAlign: 'center' }}>
        <Text>
          <Link isExternal href={getTokenLink(nft.tokenId)}>
            BitMaxx NFT OWNED TokenID {nft.tokenId.toString()}
            <img src={btm2} alt={`NFT ${nft.tokenId.toString()}`} style={{ width: '100%', maxWidth: '250px', margin: 'auto', borderRadius: '30px' }} />

          </Link>
        </Text>
      </div>
    ))}
  </div>
</div>





              </TabPanel>



              <TabPanel>

                              <div className="buttons-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                                <Button
                                  onClick={onRevealClick}
                                  textColor="white"
                                  bg={isRevealed ? '#666' : '#058ba1'}
                                  _hover={{
                                    bg: isRevealed ? '#666' : '#4d9795',
                                  }}
                                  style={{ marginRight: '1rem' }}
                                  >
                                  {isRevealed ? 'Already Revealed' : 'Reveal Collection (Only Owner)'}
                                </Button>

                                <Button
                                  onClick={onTogglePauseClick}
                                    textColor="white"
                                    bg="#058ba1"
                                    _hover={{
                                      bg: '#4d9795',
                                    }}
                                    >
                                    {isPaused ? 'UnPause Minting ' : 'Pause Minting'}
                                </Button>
                            </div>
                            <Text className="pauseStatus" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: isPaused ? 'red' : 'green' }}>
                              {isPaused ? 'NFT Minting currently Paused' : 'NFT Minting is Open!'}
                            </Text>
                            <Text className="paragraph1" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                              {loading ? 'Loading...' : `NFT Price: ${cost} PWR`}
                            </Text>
                            <div className="buttons-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>

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
                               bg="#058ba1"
                               _hover={{
                                 bg: '#4d9795',
                               }}
                               >
                               Set Cost
                               </Button>

                             </Box>
                             </div>

                             <Text className="paragraph1" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                               {loading ? 'Loading...' : `Contract Balance: ${contractBalanceValue} PWR`}
                             </Text>
                                           <Box marginTop='2' display='flex' alignItems='center' justifyContent='center'>
                             <Button
                                                     onClick={onWithdrawClick}
                                                     textColor="white"
                                                     bg="#058ba1"
                                                     _hover={{
                                                       bg: '#4d9795',
                                                     }}
                                                   >
                                                     {withdrawLoading ? 'Withdrawing...' : 'Withdraw Funds (Only Owner)'}
                                                   </Button>

                                                                  </Box>

              <div>



</div>

<Text className="paragraph1" style={{ padding: '10px', textAlign: 'center', fontWeight: 'normal' }}>
To process rewards, ensure SafuMaxx has been sent to contract {SPLITTER_CONTRACT_ADDRESS}. The balance will update in Pending reward. To process rewards, first "sync payee" list,  this will update the rewards to the current nft holders, then after sync performed and success click the "send rewards" button.
</Text>
<Text className="paragraph1" style={{ padding: '10px', textAlign: 'center', fontWeight: 'normal' }}>
Native PWR can be sent to the following contract 0x70807A0d4871B18062EE72d32C91C3d393a067f6

</Text>
<Text className="paragraph1" style={{ padding: '10px', textAlign: 'center', fontWeight: 'normal' }}>
Sending PWR to address above will swap the value of PWR first to SafuMaxx Token and then send the Safu tokens to the NFT rewards contract ready for distribution to existing holders of BitMaxx NFT
</Text>



<Text className="setCost" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
Pending NFT Rewards: {tokenBalance} SafuMaxx
</Text>

<div className="buttons-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
  <Button
    onClick={handleUpdatePayees}
    textColor="white"
    bg="#058ba1"
    _hover={{ bg: '#4d9795' }}
    style={{ marginRight: '1rem' }}  // Add marginRight here for spacing
  >
    Sync Payees
  </Button>

  <Button
    onClick={() => distributeTokens()}
    textColor="white"
    bg="#058ba1"
    _hover={{
      bg: '#4d9795',
    }}
  >
    Send Rewards
  </Button>
</div>
<Text className="paragraph1" style={{ padding: '10px', textAlign: 'center', fontWeight: 'normal' }}>
Total Distributed: {totalDistributed} Safumaxx Rewarded to NFT Holders
</Text>

</TabPanel>

           </TabPanels>
          </Tabs>
            <Text className="paragraph1" style={{ color: 'white', padding: '20px', textAlign: 'center' }}>
              &copy; BitMaxx NFT Collection 2023. All rights reserved.
            </Text>

<div style={{ display: 'flex', justifyContent: 'center' }}>


<Text className="link" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
<Link isExternal href="https://t.me/bittmaxx"><FaTelegram /></Link>
</Text>

<Text className="link" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
<Link isExternal href="https://twitter.com/BitMaxx_Token"><FaTwitter /></Link>
</Text>

<Text className="link" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
<Link isExternal href="https://bitmaxx.io"><FaGlobe /></Link>
</Text>

<Text className="link" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
<Link isExternal href="https://github.com/ArielRin/BitMaxx-NFT-Collection--BNFT"><FaGithub /></Link>
</Text>

</div>
          </Container>
        </div>
      </div>
    </>
  );
}

export default App;




//
// {userNfts.map((nft) => (
//   <div key={nft.tokenId.toString()}>
//     <img src={btm} alt={`NFT ${nft.tokenId.toString()}`} style={{ width: '100%' }} />
//     <Text>Token ID: {nft.tokenId.toString()}</Text>
//   </div>
// ))}


//


// // Holderlist display
// <textarea
//   value={holdersString}
//   readOnly
//   style={{
//     width: '100%',
//     height: '200px',
//     fontSize: '0.8em',
//     color: 'black', // Set text color to white
//     backgroundColor: 'white', // Optional: Change background if needed for better visibility
//     border: '1px solid gray' // Optional: Add a border for better visibility
//   }}
// />

                //
                // <Text className="paragraph1" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                //   {loading ? 'Loading...' : `Contract Balance: ${ethers.utils.formatEther(contractBalance)} PWR`}
                // </Text>
