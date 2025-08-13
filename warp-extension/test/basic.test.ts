/**
 * Basic Infrastructure Test
 * 
 * Tests to verify that the testing environment is properly configured.
 */

describe('Testing Infrastructure', () => {
  it('should run TypeScript tests', () => {
    const message: string = 'Hello, TypeScript!';
    expect(message).toBe('Hello, TypeScript!');
  });

  it('should have access to Node.js environment', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.MCP_SERVER_PORT).toBe('8765');
  });

  it('should have Jest globals available', () => {
    expect(jest).toBeDefined();
    expect(describe).toBeDefined();
    expect(it).toBeDefined();
    expect(expect).toBeDefined();
  });

  it('should support async tests', async () => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(10);
    expect(true).toBe(true);
  });

  it('should have mocked WebSocket available', () => {
    expect(global.WebSocket).toBeDefined();
    const ws = new (global.WebSocket as any)();
    expect(typeof ws.send).toBe('function');
    expect(typeof ws.close).toBe('function');
    expect(ws.readyState).toBe(1); // OPEN
  });
});
