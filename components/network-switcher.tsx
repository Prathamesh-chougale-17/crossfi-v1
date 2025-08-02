'use client';

import { useState } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { ChevronDown, Check, Loader2, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Network configurations with their icons and details
const networkConfigs = {
  1: { name: 'Ethereum', color: '#627EEA', icon: '🔷', rpc: 'mainnet' },
  137: { name: 'Polygon', color: '#8247E5', icon: '💜', rpc: 'polygon' },
  4158: {
    name: "CrossFi Mainnet", color: "#FF0420", icon: "🔴", rpc: "crossfi-mainnet"
  },
  4157: {
    name: "CrossFi Testnet", color: "#FF0420", icon: "🔵", rpc: "crossfi-testnet"
  },
};

export function NetworkSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  const currentNetwork = chainId ? networkConfigs[chainId as keyof typeof networkConfigs] : null;

  const handleNetworkSwitch = (targetChainId: number) => {
    switchChain({ chainId: targetChainId });
    setIsOpen(false);
  };

  // Don't show if wallet is not connected
  if (!isConnected) {
    return null;
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 hover:bg-slate-50 min-w-[120px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        {currentNetwork ? (
          <>
            <span className="text-sm">{currentNetwork.icon}</span>
            <span className="text-sm font-medium text-slate-700 hidden sm:inline">
              {currentNetwork.name}
            </span>
            <Wifi className="w-3 h-3 text-green-500" />
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-red-600 hidden sm:inline">
              Unsupported
            </span>
          </>
        )}
        <ChevronDown className="w-4 h-4 text-slate-500" />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50 min-w-[200px] backdrop-blur-sm">
            <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              Switch Network
            </div>
            
            {Object.entries(networkConfigs).map(([targetChainId, config]) => {
              const isCurrentChain = chainId === parseInt(targetChainId);
              const isChainPending = isPending;
              
              return (
                <button
                  key={targetChainId}
                  onClick={() => handleNetworkSwitch(parseInt(targetChainId))}
                  disabled={isPending}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-50 transition-colors ${
                    isCurrentChain ? 'bg-green-50' : ''
                  } ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span className="text-lg">{config.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-900">
                      {config.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      Chain ID: {targetChainId}
                    </div>
                  </div>
                  
                  {isChainPending ? (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  ) : isCurrentChain ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : null}
                </button>
              );
            })}
            
            <div className="px-3 py-2 border-t border-slate-100 mt-2">
              <div className="text-xs text-slate-400">
                {process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' 
                  ? '🧪 Testnet mode enabled' 
                  : '🏭 Mainnet mode'
                }
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}