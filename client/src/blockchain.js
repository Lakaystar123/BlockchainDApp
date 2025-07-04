import { ethers } from "ethers";
import abi from "./TransactionsABI.json";

const CONTRACT_ADDRESS = "0x006449DdBF47FD3a5cF7D7143B2297F0Ab7f2b2e";

export function getContract(signerOrProvider) {
  return new ethers.Contract(CONTRACT_ADDRESS, abi, signerOrProvider);
}