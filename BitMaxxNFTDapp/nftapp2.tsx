// App.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
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
import AnunakiNFTRewardsStaking from './AnunakiNFTRewardsStaking.json'; // Make sure to replace with the correct path

const STAKING_CONTRACT_ADDRESS = '0xYourStakingContractAddress'; // Replace with your actual contract address
const STAKING_CONTRACT_ABI = AnunakiNFTRewardsStaking.abi;

function App() {
  const account = useAccount();
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
      await stake([amountToStake]);
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
      await unstake([amountToUnstake]);
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

  return (
    
    <Container>
      <Box>
        <Text>Your Staked NFTs: {stakedNFTs}</Text>
        <Text>Reward Debt: {rewardDebt}</Text>
        <Input
          type="number"
          placeholder="Amount to Stake"
          value={stakeAmount}
          onChange={(e) => setStakeAmount(e.target.value)}
        />
        <Button onClick={handleStake} isLoading={stakeLoading}>
          Stake NFTs
        </Button>
      </Box>
      <Box>
        <Input
          type="number"
          placeholder="Amount to Unstake"
          value={unstakeAmount}
          onChange={(e) => setUnstakeAmount(e.target.value)}
        />
        <Button onClick={handleUnstake} isLoading={unstakeLoading}>
          Unstake NFTs
        </Button>
      </Box>
      <Box>
        <Button onClick={handleClaim} isLoading={claimLoading}>
          Claim Rewards
        </Button>
      </Box>
    </Container>
  );
}

export default App;
