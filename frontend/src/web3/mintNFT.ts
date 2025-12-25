import { ethers } from "ethers";
import LiTreeNFT from "../../../contracts/LiTreeNFT.sol/LiTreeNFT.json";

export async function mintNFT(provider: ethers.BrowserProvider, contractAddress: string, tokenURI: string, isLootBox = false) {
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, LiTreeNFT.abi, signer);
  const mintFn = isLootBox ? contract.mintLootBox : contract.mintNFT;
  const tx = await mintFn(tokenURI, { value: await contract.mintPrice() });
  await tx.wait();
  return tx.hash;
}
