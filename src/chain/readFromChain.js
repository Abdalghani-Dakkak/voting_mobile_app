import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, SEPOLIA_RPC_URL } from '../config/web3auth';
import CONTRACT_ABI from '../contracts/IRVVotingABI.json';

// Read-only calls against the deployed IRVVoting contract on Sepolia.
// These never need a connected wallet or gas — a public RPC provider is enough.
const getReadProvider = () => new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);

const getReadContract = () => new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, getReadProvider());

export async function getUserRoleFromChain(userAddress) {
  try {
    const contract = getReadContract();
    const role = await contract.getUserRole(userAddress);
    return role; // "Admin" | "Organization" | "Auditor" | "User"
  } catch (err) {
    console.warn('getUserRoleFromChain failed:', err.message);
    return 'User';
  }
}

export async function getPollDetailsFromChain(chainPollId) {
  try {
    const contract = getReadContract();
    const [title, startTime, endTime, candidateCount, maxChoices, candidateNames, auditors, creator, voteType, currentState, winnerIndex] =
      await contract.getPollDetails(chainPollId);
    return {
      title,
      startTime: Number(startTime),
      endTime: Number(endTime),
      candidateCount: Number(candidateCount),
      maxChoices: Number(maxChoices),
      candidateNames,
      auditors,
      creator,
      voteType: Number(voteType),
      currentState: Number(currentState),
      winnerIndex: Number(winnerIndex),
    };
  } catch (err) {
    console.warn('getPollDetailsFromChain failed:', err.message);
    return null;
  }
}

export async function checkHasUserVoted(chainPollId, userAddress) {
  try {
    const contract = getReadContract();
    return await contract.hasUserVoted(chainPollId, userAddress);
  } catch (err) {
    console.warn('checkHasUserVoted failed:', err.message);
    return false;
  }
}

export async function checkIsAllowedVoter(chainPollId, userAddress) {
  try {
    const contract = getReadContract();
    return await contract.isAllowedVoter(chainPollId, userAddress);
  } catch (err) {
    console.warn('checkIsAllowedVoter failed:', err.message);
    return false;
  }
}

export async function getPollWinnerFromChain(chainPollId) {
  try {
    const contract = getReadContract();
    const provider = getReadProvider();
    const filter = contract.filters.PollFinalized(chainPollId);
    const events = await contract.queryFilter(filter, 0, await provider.getBlockNumber());
    if (events.length > 0) {
      return Number(events[events.length - 1].args.winnerIndex);
    }
    const winnerIndex = await contract.computeWinner(chainPollId);
    return Number(winnerIndex);
  } catch (err) {
    console.warn('getPollWinnerFromChain failed:', err.message);
    return null;
  }
}
