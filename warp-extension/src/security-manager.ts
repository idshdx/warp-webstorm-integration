/**
 * Security Manager - handles authentication and authorization
 */

import { logger } from './utils/logger';

export class SecurityManager {
  private initialized = false;

  constructor(private enableSecurity: boolean) {
    logger.info(`Security Manager created (enabled: ${enableSecurity})`);
  }

  async initialize(): Promise<void> {
    if (this.enableSecurity) {
      logger.info('Initializing security features...');
      // In production: load certificates, setup encryption, etc.
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    this.initialized = true;
    logger.info('Security Manager initialized');
  }

  async authorizeConnection(request: any): Promise<boolean> {
    if (!this.enableSecurity) {
      return true; // Allow all connections when security is disabled
    }

    // In production: implement proper authorization logic
    const clientIP = request.socket.remoteAddress;
    const isLocalhost = clientIP === '127.0.0.1' || clientIP === '::1' || clientIP?.startsWith('::ffff:127.');
    
    if (isLocalhost) {
      logger.debug(`Authorized local connection from ${clientIP}`);
      return true;
    }

    logger.warn(`Rejected connection from non-localhost IP: ${clientIP}`);
    return false;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}
