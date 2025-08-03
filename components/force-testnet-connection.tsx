'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Zap, Check, AlertTriangle, RefreshCw } from 'lucide-react';

// Different CrossFi RPC URLs to try
const CROSSFI_RPC_URLS = [
  'https://rpc.testnet.ms',
  'https://testnet-rpc.crossfi.io',
  'https://rpc.testnet.crossfi.io',
  'https://crossfi-testnet.publicnode.com',
];

export function ForceTestnetConnection() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentRpcIndex, setCurrentRpcIndex] = useState(0);

  const testRpcConnection = async (rpcUrl: string) => {
    try {
      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_chainId',
          params: [],
          id: 1,
        }),
      });
      
      const data = await response.json();
      if (data.result) {
        const chainId = parseInt(data.result, 16);
        return { success: true, chainId, hex: data.result };
      } else {
        return { success: false, error: data.error?.message || 'No result' };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const testAllRpcs = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    let workingRpc = null;
    for (let i = 0; i < CROSSFI_RPC_URLS.length; i++) {
      const rpcUrl = CROSSFI_RPC_URLS[i];
      setResult(`Testing ${rpcUrl}...`);
      
      const testResult = await testRpcConnection(rpcUrl);
      if (testResult.success) {
        workingRpc = { url: rpcUrl, chainId: testResult.chainId, hex: testResult.hex };
        break;
      }
    }

    if (workingRpc) {
      setResult(`✅ Found working RPC: ${workingRpc.url} (Chain ID: ${workingRpc.chainId})`);
      setCurrentRpcIndex(CROSSFI_RPC_URLS.indexOf(workingRpc.url));
    } else {
      setError('❌ No working CrossFi RPC endpoints found');
    }

    setIsLoading(false);
  };

  const forceAddTestnet = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not detected');
      }

      const rpcUrl = CROSSFI_RPC_URLS[currentRpcIndex];
      
      // Force add the network with current RPC
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x1045', // 4157 in hex (CrossFi Testnet)
          chainName: 'CrossFi Testnet',
          nativeCurrency: {
            name: 'CrossFi XFI',
            symbol: 'XFI',
            decimals: 18,
          },
          rpcUrls: [rpcUrl],
          blockExplorerUrls: ['https://test.xfiscan.com'],
        }],
      });

      // Try to switch to it
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1045' }],
      });

      setResult(`✅ Successfully added and switched to CrossFi Testnet using ${rpcUrl}`);

    } catch (err: any) {
      console.error('Network addition error:', err);
      setError(err.message || 'Failed to add network');
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentNetworkInfo = async () => {
    try {
      if (!window.ethereum) {
        setError('MetaMask not detected');
        return;
      }

      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      
      const chainIdDecimal = parseInt(chainId, 16);
      let networkName = 'Unknown';
      
      if (chainIdDecimal === 4157) networkName = 'CrossFi Testnet';
      else if (chainIdDecimal === 4158) networkName = 'CrossFi Mainnet';
      else if (chainIdDecimal === 1) networkName = 'Ethereum Mainnet';
      else if (chainIdDecimal === 137) networkName = 'Polygon';
      
      setResult(`Current: ${networkName} (${chainIdDecimal}), Connected: ${accounts.length > 0 ? 'Yes' : 'No'}`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Card className="max-w-xl mx-auto mt-4">
      <CardHeader>
        <CardTitle className="text-sm">🔧 Force CrossFi Testnet Connection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={testAllRpcs} 
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Test RPCs
          </Button>

          <Button 
            onClick={forceAddTestnet} 
            disabled={isLoading}
            size="sm"
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            Force Add Testnet
          </Button>

          <Button 
            onClick={getCurrentNetworkInfo} 
            variant="outline"
            size="sm"
            className="col-span-2"
          >
            Check Current Network
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
          <p><strong>Available RPC URLs:</strong></p>
          {CROSSFI_RPC_URLS.map((url, index) => (
            <p key={index} className={index === currentRpcIndex ? 'font-bold' : ''}>
              {index === currentRpcIndex ? '→ ' : '  '}{url}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}