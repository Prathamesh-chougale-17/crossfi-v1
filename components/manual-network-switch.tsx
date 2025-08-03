'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Zap, Check, AlertTriangle } from 'lucide-react';

export function ManualNetworkSwitch() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const switchToTestnet = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not detected');
      }

      // First try to switch to existing network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1045' }], // 4157 in hex
        });
        setResult('Successfully switched to CrossFi Testnet!');
      } catch (switchError: any) {
        // If network doesn't exist (4902), add it first
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x1045', // 4157 in hex
              chainName: 'CrossFi Testnet',
              nativeCurrency: {
                name: 'CrossFi XFI',
                symbol: 'XFI',
                decimals: 18,
              },
              rpcUrls: ['https://rpc.testnet.ms'],
              blockExplorerUrls: ['https://test.xfiscan.com'],
            }],
          });

          // Try switching again after adding
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x1045' }],
          });

          setResult('Added and switched to CrossFi Testnet!');
        } else {
          throw switchError;
        }
      }

    } catch (err: any) {
      console.error('Network switch error:', err);
      setError(err.message || 'Failed to switch network');
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentNetwork = async () => {
    try {
      if (!window.ethereum) {
        setError('MetaMask not detected');
        return;
      }

      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      
      setResult(`Current Chain ID: ${chainId} (${parseInt(chainId, 16)}), Connected: ${accounts.length > 0 ? 'Yes' : 'No'}`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Card className="max-w-lg mx-auto mt-4">
      <CardHeader>
        <CardTitle className="text-sm">🔧 Manual Network Control</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={switchToTestnet} 
            disabled={isLoading}
            className="flex items-center gap-2"
            size="sm"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            Switch to Testnet
          </Button>

          <Button 
            onClick={getCurrentNetwork} 
            variant="outline"
            size="sm"
          >
            Check Current
          </Button>
        </div>

        {result && (
          <Alert>
            <Check className="h-4 w-4" />
            <AlertDescription className="text-xs">{result}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">{error}</AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Target Network:</strong></p>
          <p>• Name: CrossFi Testnet</p>
          <p>• Chain ID: 4157 (0x1045)</p>
          <p>• RPC: https://rpc.testnet.ms</p>
        </div>
      </CardContent>
    </Card>
  );
}