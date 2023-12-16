import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import abiFile from './abiFile.json';

const CONTRACT_ADDRESS = '0xaA0015FbB55b0f9E3dF74e0827a63099e4201E38';

function HoldersList() {
  const [holders, setHolders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHolders = async () => {
      const provider = new ethers.providers.JsonRpcProvider('https://mainrpc4.maxxchain.org/');
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abiFile, provider);
      const totalSupply = await contract.totalSupply();

      let addresses = [];
      for (let i = 1; i <= totalSupply; i++) {
        const owner = await contract.ownerOf(i);
        addresses.push(owner);
      }

      setHolders(addresses);
      setLoading(false);
    };

    fetchHolders();
  }, []);

  if (loading) {
    return <div>Loading holders...</div>;
  }

  return (
    <div>
      <h2>NFT Holders</h2>
      {holders.map((address, index) => (
        <p key={index}>{address}</p>
      ))}
    </div>
  );
}

export default HoldersList;
