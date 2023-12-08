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
  Input,
} from '@chakra-ui/react';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import AnunakiNFTRewardsStaking from './AnunakiNFTRewardsStaking.json'; // Replace with the correct path

import abiFile from './abiFile.json';
import './styles.css'; // Reference to the external CSS file

import backgroundGif from './horse.gif';
import HausLogo1 from './logo.png';
import MainTextLogo from './headerlogo.png';

const STAKING_CONTRACT_ADDRESS = '0xYourStakingContractAddress'; // Replace with your actual contract address
const STAKING_CONTRACT_ABI = './AnunakiNFTRewardsStaking.json';

const CONTRACT_ADDRESS = '0x172499980D37E6590b1bB7BFA0b51C64Dd34f84b';
const getExplorerLink = () => `https://bscscan.com/token/${CONTRACT_ADDRESS}`;
const getOpenSeaURL = () => `https://testnets.opensea.io/assets/goerli/${CONTRACT_ADDRESS}`;

function App() {
  const account = useAccount();
  const [contractName, setContractName] = useState('');
  const [totalSupply, setTotalSupply] = useState(0);
  const [loading, setLoading] = useState(true);

  const [stakedNFTs, setStakedNFTs] = useState(0);
  const [rewardDebt, setRewardDebt] = useState(0);
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [claimLoading, setClaimLoading] = useState(false);
  const [stakeLoading, setStakeLoading] = useState(false);
  const [unstakeLoading, setUnstakeLoading] = useState(false);
  const toast = useToast();

  const stakingContractConfig = {
    addressOrName: STAKING_CONTRACT_ADDRESS,
    contractInterface: STAKING_CONTRACT_ABI,
  };

  const { read: getStakedInfo } = useContractRead({
    ...stakingContractConfig,
    functionName: 'userInfo',
  });

  const { writeAsync: stake } = useContractWrite({
    ...stakingContractConfig,
    functionName: 'stake',
  });

  const { writeAsync: unstake } = useContractWrite({
    ...stakingContractConfig,
    functionName: 'unstake',
  });

  const { writeAsync: claim } = useContractWrite({
    ...stakingContractConfig,
    functionName: 'claim',
  });

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
    const fetchStakingInfo = async () => {
      try {
        const result = await getStakedInfo([account]);
        setStakedNFTs(result[0]);
        setRewardDebt(result[1]);
      } catch (error) {
        console.error('Error fetching staking info:', error);
      }
    };

    if (account) {
      fetchStakingInfo();
    }
  }, [account, getStakedInfo]);

  const handleStake = async () => {
    try {
      setStakeLoading(true);
      const amountToStake = ethers.utils.parseUnits(stakeAmount, 18);
      await stake({ args: [amountToStake] });
      toast({
        title: 'Staking Successful',
        description: `You have successfully staked ${stakeAmount} NFTs.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error staking:', error);
      toast({
        title: 'Staking Failed',
        description: 'There was an error while staking NFTs. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setStakeAmount('');
      setStakeLoading(false);
    }
  };

  const handleUnstake = async () => {
    try {
      setUnstakeLoading(true);
      const amountToUnstake = ethers.utils.parseUnits(unstakeAmount, 18);
      await unstake({ args: [amountToUnstake] });
      toast({
        title: 'Unstaking Successful',
        description: `You have successfully unstaked ${unstakeAmount} NFTs.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error unstaking:', error);
      toast({
        title: 'Unstaking Failed',
        description: 'There was an error while unstaking NFTs. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setUnstakeAmount('');
      setUnstakeLoading(false);
    }
  };

  const handleClaim = async () => {
    try {
      setClaimLoading(true);
      await claim();
      toast({
        title: 'Claim Successful',
        description: 'You have successfully claimed your rewards.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error claiming rewards:', error);
      toast({
        title: 'Claim Failed',
        description: 'There was an error while claiming rewards. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setClaimLoading(false);
    }
  };

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
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchContractData();
  }, []);

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
                <Tab>NFT Staking</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>


                <div>

                      <img src={MainTextLogo} alt="Lastman DeFi" className="logobody" />
                  <Text className="paragraph1" style={{ textAlign: 'center', fontWeight: 'bold' }}>

          LastManHolding NFT will reward a random existing holder with 10% of the purchase price of last NFT sold.
          Every NFT purchased will reward a current holder randomly until there is only one left. The last NFT sold will earn a total
          of 10% (1.5BNB) of the entire treasury, total value of all the NFTS sold.
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
                  <Container>
                    <Box>
                      <Text>Your Staked NFTs: {stakedNFTs}</Text>
                      <Text>Reward Debt: {rewardDebt}</Text>
                      <Input
                        type="number"
                        placeholder="NFTs to Stake"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                      />
                      <Button
                        marginTop='1'
                        textColor='white'
                        bg='#0c5cb6'
                        onClick={handleStake}
                        isLoading={stakeLoading}
                        >
                        Stake NFTs
                      </Button>
                    </Box>
                    <Box>
                      <Input
                        type="number"
                        placeholder="NFTs to Unstake"
                        value={unstakeAmount}
                        onChange={(e) => setUnstakeAmount(e.target.value)}
                      />
                      <Button
                        marginTop='1'
                        textColor='white'
                        bg='#0c5cb6'
                        onClick={handleUnstake}
                        isLoading={unstakeLoading}
                        >
                        Unstake NFTs
                      </Button>
                    </Box>
                    <Box>
                    <Button
                      marginTop='1'
                      textColor='white'
                      bg='#0c5cb6'
                      onClick={handleClaim}
                      isLoading={claimLoading}
                      >
                        Claim Rewards
                      </Button>
                    </Box>
                  </Container>
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
