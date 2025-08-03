'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Plus, Check, AlertTriangle } from 'lucide-react';

interface NetworkConfig {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

const CROSSFI_TESTNET_CONFIG: NetworkConfig = {
  chainId: '0x1045', // 4157 in hex
  chainName: 'CrossFi Testnet',
  nativeCurrency: {
    name: 'CrossFi XFI',
    symbol: 'XFI',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.testnet.ms'],
  blockExplorerUrls: ['https://test.xfiscan.com'],
};

const CROSSFI_MAINNET_CONFIG: NetworkConfig = {
  chainId: '0x1046', // 4158 in hex
  chainName: 'CrossFi Mainnet',
  nativeCurrency: {
    name: 'CrossFi XFI',
    symbol: 'XFI',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.crossfi.io'],
  blockExplorerUrls: ['https://xfiscan.com'],
};

export function AddCrossFiNetwork({ variant = 'testnet' }: { variant?: 'testnet' | 'mainnet' }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const config = variant === 'testnet' ? CROSSFI_TESTNET_CONFIG : CROSSFI_MAINNET_CONFIG;

  const addNetwork = async () => {
    setIsAdding(true);
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [config],
      });

      setIsAdded(true);
      
      // Try to switch to the network after adding
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: config.chainId }],
      });

    } catch (err: any) {
      console.error('Error adding network:', err);
      
      if (err.code === 4902) {
        setError('Network already exists in MetaMask');
      } else if (err.code === -32002) {
        setError('MetaMask request already pending. Please check your MetaMask extension.');
      } else if (err.code === 4001) {
        setError('User rejected the request');
      } else {
        setError(err.message || 'Failed to add network');
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-slate-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
          {variant === 'testnet' ? '🔵' : '🔴'}
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">
            Add {config.chainName} to MetaMask
          </h3>
          <p className="text-sm text-slate-600">
            Chain ID: {parseInt(config.chainId, 16)} | RPC: {config.rpcUrls[0]}
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button
          onClick={addNetwork}
          disabled={isAdding || isAdded}
          className="flex items-center gap-2"
          variant={isAdded ? "outline" : "default"}
        >
          {isAdding ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Adding...
            </>
          ) : isAdded ? (
            <>
              <Check className="w-4 h-4" />
              Added to MetaMask
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add to MetaMask
            </>
          )}
        </Button>

        <Button
          variant="outline"
          asChild
          className="flex items-center gap-2"
        >
          <a
            href={config.blockExplorerUrls[0]}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="w-4 h-4" />
            Explorer
          </a>
        </Button>
      </div>

      <div className="text-xs text-slate-500 space-y-1">
        <p><strong>Network Details:</strong></p>
        <p>• Chain ID: {config.chainId} ({parseInt(config.chainId, 16)})</p>
        <p>• RPC URL: {config.rpcUrls[0]}</p>
        <p>• Symbol: {config.nativeCurrency.symbol}</p>
        <p>• Explorer: {config.blockExplorerUrls[0]}</p>
      </div>
    </div>
  );
}