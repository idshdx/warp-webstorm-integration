/**
 * Warp-WebStorm Integration Extension
 * Main entry point for the MCP server and AI coordination
 */

import { MCPServer } from './mcp-server';
import { logger } from './utils/logger';

async function main(): Promise<void> {
  try {
    logger.info('Starting Warp-WebStorm Integration Extension');
    
    const mcpServer = new MCPServer();
    await mcpServer.start();
    
    logger.info('Extension started successfully');
  } catch (error) {
    logger.error('Failed to start extension:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  logger.info('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

if (require.main === module) {
  main().catch((error) => {
    logger.error('Unhandled error in main:', error);
    process.exit(1);
  });
}
