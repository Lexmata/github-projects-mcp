#!/usr/bin/env node

import { loadConfig } from './config.js';
import { runServer } from './server.js';

async function main(): Promise<void> {
  try {
    const config = loadConfig();
    await runServer(config);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Failed to start server: ${message}`);
    process.exit(1);
  }
}

main().catch(console.error);
