'use client';

import { useAccount, useChainId } from 'wagmi';
import { useCrossFiNetwork } from '@/lib/gamefi/gamefi-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function NetworkDebug() {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const { isCrossFi, isMainnet, isTestnet, networkName } = useCrossFiNetwork();

  return (
    <Card className="max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle className="text-sm">🔍 Network Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span>Connected:</span>
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? "Yes" : "No"}
          </Badge>
        </div>
        
        <div className="flex justify-between">
          <span>Address:</span>
          <span className="font-mono text-xs">
            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'None'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Chain ID:</span>
          <Badge variant="outline">{chainId || 'Unknown'}</Badge>
        </div>
        
        <div className="flex justify-between">
          <span>Network Name:</span>
          <span>{networkName}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Is CrossFi:</span>
          <Badge variant={isCrossFi ? "default" : "destructive"}>
            {isCrossFi ? "Yes" : "No"}
          </Badge>
        </div>
        
        <div className="flex justify-between">
          <span>Is Testnet:</span>
          <Badge variant={isTestnet ? "default" : "outline"}>
            {isTestnet ? "Yes" : "No"}
          </Badge>
        </div>
        
        <div className="flex justify-between">
          <span>Is Mainnet:</span>
          <Badge variant={isMainnet ? "default" : "outline"}>
            {isMainnet ? "Yes" : "No"}
          </Badge>
        </div>
        
        <div className="mt-4 pt-2 border-t">
          <div className="text-xs text-muted-foreground">
            <p><strong>Expected for testnet:</strong></p>
            <p>Chain ID: 4157</p>
            <p>Network: CrossFi Testnet</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}