/**
 * FARCASTER WALLET INTEGRATION
 * Handle wallet connections and transactions
 */

import { sdk } from './sdk';
import { MonetizationCalculator, USDC_CONTRACT } from '@/config/monetization.config';
import { ethers } from 'ethers';

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  provider: ethers.BrowserProvider | null;
  balance: string;
}

type TransactionReceipt = Awaited<ReturnType<ethers.ContractTransactionResponse['wait']>>;

/**
 * Get Ethereum provider from Farcaster SDK
 */
export async function getEthereumProvider(): Promise<ethers.BrowserProvider | null> {
  try {
    const provider = await sdk.wallet.getEthereumProvider();
    
    if (!provider) {
      return null;
    }

    // Wrap in ethers provider
    return new ethers.BrowserProvider(provider as any);
  } catch (error) {
    console.error('Failed to get Ethereum provider:', error);
    return null;
  }
}

/**
 * Get user's wallet address
 */
export async function getWalletAddress(): Promise<string | null> {
  try {
    const provider = await getEthereumProvider();
    if (!provider) return null;

    const signer = await provider.getSigner();
    return await signer.getAddress();
  } catch (error) {
    console.error('Failed to get wallet address:', error);
    return null;
  }
}

/**
 * Get user's USDC balance
 */
export async function getUSDCBalance(): Promise<string> {
  try {
    const provider = await getEthereumProvider();
    if (!provider) return '0';

    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    // USDC contract ABI (balanceOf)
    const usdcAbi = ['function balanceOf(address owner) view returns (uint256)'];
    const usdcContract = new ethers.Contract(
      USDC_CONTRACT.address,
      usdcAbi,
      provider
    );

    const balance = await usdcContract.balanceOf(address);
    const formatted = ethers.formatUnits(balance, USDC_CONTRACT.decimals);
    
    return formatted;
  } catch (error) {
    console.error('Failed to get USDC balance:', error);
    return '0';
  }
}

/**
 * Check if user has approved USDC spending for contract
 */
export async function getUSDCAllowance(spenderAddress: string): Promise<string> {
  try {
    const provider = await getEthereumProvider();
    if (!provider) return '0';

    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    // USDC contract ABI (allowance)
    const usdcAbi = ['function allowance(address owner, address spender) view returns (uint256)'];
    const usdcContract = new ethers.Contract(
      USDC_CONTRACT.address,
      usdcAbi,
      provider
    );

    const allowance = await usdcContract.allowance(address, spenderAddress);
    return ethers.formatUnits(allowance, USDC_CONTRACT.decimals);
  } catch (error) {
    console.error('Failed to get USDC allowance:', error);
    return '0';
  }
}

/**
 * Approve USDC spending for contract
 */
export async function approveUSDC(
  spenderAddress: string,
  amount: string
): Promise<ethers.ContractTransactionResponse | null> {
  try {
    const provider = await getEthereumProvider();
    if (!provider) return null;

    const signer = await provider.getSigner();

    // USDC contract ABI (approve)
    const usdcAbi = ['function approve(address spender, uint256 amount) returns (bool)'];
    const usdcContract = new ethers.Contract(
      USDC_CONTRACT.address,
      usdcAbi,
      signer
    );

    const amountWei = ethers.parseUnits(amount, USDC_CONTRACT.decimals);
    const tx = await usdcContract.approve(spenderAddress, amountWei);
    
    return tx;
  } catch (error) {
    console.error('Failed to approve USDC:', error);
    throw error;
  }
}

/**
 * Transfer USDC
 */
export async function transferUSDC(
  to: string,
  amount: string
): Promise<ethers.ContractTransactionResponse | null> {
  try {
    const provider = await getEthereumProvider();
    if (!provider) return null;

    const signer = await provider.getSigner();

    // USDC contract ABI (transfer)
    const usdcAbi = ['function transfer(address to, uint256 amount) returns (bool)'];
    const usdcContract = new ethers.Contract(
      USDC_CONTRACT.address,
      usdcAbi,
      signer
    );

    const amountWei = ethers.parseUnits(amount, USDC_CONTRACT.decimals);
    const tx = await usdcContract.transfer(to, amountWei);
    
    return tx;
  } catch (error) {
    console.error('Failed to transfer USDC:', error);
    throw error;
  }
}

/**
 * Wait for transaction confirmation
 */
export async function waitForTransaction(
  tx: ethers.ContractTransactionResponse,
  confirmations: number = 1
): Promise<TransactionReceipt | null> {
  try {
    return await tx.wait(confirmations);
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
}

/**
 * Check if wallet is connected
 */
export async function isWalletConnected(): Promise<boolean> {
  try {
    const address = await getWalletAddress();
    return address !== null;
  } catch {
    return false;
  }
}

/**
 * Get complete wallet state
 */
export async function getWalletState(): Promise<WalletState> {
  const provider = await getEthereumProvider();
  const address = await getWalletAddress();
  const balance = await getUSDCBalance();

  return {
    isConnected: provider !== null && address !== null,
    address,
    provider,
    balance,
  };
}

