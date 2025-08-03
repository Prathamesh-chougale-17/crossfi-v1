#!/usr/bin/env node

/**
 * Simple test script to verify MCP server functionality
 * Run this after building the server to test basic operations
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 Testing Jeu Plaza MCP Server...\n');

// Test data
const testWallet = '0x1234567890abcdef1234567890abcdef12345678';
const testGameName = 'Test Pong Game';
const testPrompt = 'Create a simple pong game with two paddles and a bouncing ball';

// Start the MCP server
const serverPath = join(__dirname, 'dist', 'index.js');
const server = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let testStep = 0;
const tests = [
  'list_tools',
  'create_game',
  'list_games',
  'get_game',
  'update_game'
];

server.stdout.on('data', (data) => {
  console.log('Server output:', data.toString());
});

server.stderr.on('data', (data) => {
  const output = data.toString();
  if (output.includes('Jeu Plaza MCP server running on stdio')) {
    console.log('✅ Server started successfully');
    runNextTest();
  } else {
    console.log('Server stderr:', output);
  }
});

function runNextTest() {
  if (testStep >= tests.length) {
    console.log('\n🎉 All tests completed!');
    server.kill();
    return;
  }

  const testName = tests[testStep];
  console.log(`\n📋 Running test ${testStep + 1}/${tests.length}: ${testName}`);
  
  let request;
  
  switch (testName) {
    case 'list_tools':
      request = {
        jsonrpc: '2.0',
        id: testStep + 1,
        method: 'tools/list'
      };
      break;
      
    case 'create_game':
      request = {
        jsonrpc: '2.0',
        id: testStep + 1,
        method: 'tools/call',
        params: {
          name: 'create_game',
          arguments: {
            walletAddress: testWallet,
            gameName: testGameName,
            gamePrompt: testPrompt
          }
        }
      };
      break;
      
    case 'list_games':
      request = {
        jsonrpc: '2.0',
        id: testStep + 1,
        method: 'tools/call',
        params: {
          name: 'list_games',
          arguments: {
            walletAddress: testWallet
          }
        }
      };
      break;
      
    case 'get_game':
      request = {
        jsonrpc: '2.0',
        id: testStep + 1,
        method: 'tools/call',
        params: {
          name: 'get_game',
          arguments: {
            walletAddress: testWallet,
            gameName: testGameName
          }
        }
      };
      break;
      
    case 'update_game':
      request = {
        jsonrpc: '2.0',
        id: testStep + 1,
        method: 'tools/call',
        params: {
          name: 'update_game',
          arguments: {
            walletAddress: testWallet,
            gameName: testGameName,
            updatePrompt: 'Add particle effects when the ball hits the paddles'
          }
        }
      };
      break;
  }
  
  server.stdin.write(JSON.stringify(request) + '\n');
  testStep++;
  
  // Wait a bit before next test
  setTimeout(runNextTest, 2000);
}

server.on('close', (code) => {
  console.log(`\n🔚 Server process exited with code ${code}`);
  process.exit(code);
});

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\n🛑 Test interrupted');
  server.kill();
  process.exit(0);
});