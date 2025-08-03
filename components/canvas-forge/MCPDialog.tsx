'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Copy, Settings, Server, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const MCP_CONFIG = {
  "mcpServers": {
    "jeu-plaza": {
      "command": "npx",
      "args": [
        "jeu-plaza-mcp-server@latest"
      ],
      "env": {
        "API_BASE_URL": "https://crossfi-v0.vercel.app",
        "API_KEY": "jeu-plaza-mcp-secure-key-2024"
      },
      "disabled": false,
      "autoApprove": [
        "list_games",
        "get_game"
      ]
    }
  }
};

const MCP_FEATURES = [
  {
    name: "create_game",
    description: "Create a new game for a wallet address",
    autoApproved: false
  },
  {
    name: "update_game", 
    description: "Update an existing game with new requirements",
    autoApproved: false
  },
  {
    name: "list_games",
    description: "List all games owned by a wallet address", 
    autoApproved: true
  },
  {
    name: "get_game",
    description: "Retrieve a specific game's code and details",
    autoApproved: true
  }
];

export function MCPDialog() {
  const [open, setOpen] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const copyConfig = () => {
    copyToClipboard(JSON.stringify(MCP_CONFIG, null, 2));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          MCP
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            Jeu Plaza MCP Server
          </DialogTitle>
          <DialogDescription className="space-y-2">
            <div>Model Context Protocol (MCP) integration for Claude Desktop. Connect your local Claude to Jeu Plaza's game management features.</div>
            <div className="text-xs">
              Learn more about MCP: <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">modelcontextprotocol.io</a>
            </div>
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="config" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    MCP Configuration
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={copyConfig}
                    className="gap-2"
                  >
                    <Copy className="h-3 w-3" />
                    Copy Config
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Add this to your Claude Desktop config:</h4>
                    <div className="text-xs text-muted-foreground mb-2 space-y-1">
                      <div><strong>macOS:</strong> <code>~/Library/Application Support/Claude/claude_desktop_config.json</code></div>
                      <div><strong>Windows:</strong> <code>%APPDATA%\Claude\claude_desktop_config.json</code></div>
                      <div><strong>Linux:</strong> <code>~/.config/Claude/claude_desktop_config.json</code></div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                      <code>{JSON.stringify(MCP_CONFIG, null, 2)}</code>
                    </pre>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                      <div className="h-1.5 w-1.5 bg-white rounded-full" />
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-blue-700 dark:text-blue-300">Setup Instructions:</div>
                      <ol className="list-decimal list-inside text-blue-600 dark:text-blue-400 mt-1 space-y-1">
                        <li>Copy the configuration above</li>
                        <li>Open Claude Desktop settings</li>
                        <li>Add to your <code>claude_desktop_config.json</code></li>
                        <li>Restart Claude Desktop</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  Available Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {MCP_FEATURES.map((feature) => (
                    <div 
                      key={feature.name}
                      className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                            {feature.name}
                          </code>
                          {feature.autoApproved && (
                            <Badge variant="secondary" className="gap-1 text-xs">
                              <CheckCircle className="h-3 w-3" />
                              Auto-approved
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-4">
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div className="text-sm">
                        <div className="font-medium text-green-700 dark:text-green-300">Ready to Use</div>
                        <p className="text-green-600 dark:text-green-400 mt-1">
                          Once configured, you can ask Claude Desktop to manage your Jeu Plaza games directly from the chat interface.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Example Commands:</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div><code className="bg-muted px-2 py-1 rounded text-xs">"List my games"</code> - See all your created games</div>
                      <div><code className="bg-muted px-2 py-1 rounded text-xs">"Show me the code for my latest game"</code> - Get game details and code</div>
                      <div><code className="bg-muted px-2 py-1 rounded text-xs">"Create a new snake game"</code> - Generate a new game</div>
                      <div><code className="bg-muted px-2 py-1 rounded text-xs">"Update my game to add sound effects"</code> - Modify existing games</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}