const hello = require('./hello');

describe('hello world', () => { 
  it('should say hello world', () => { 
    expect(hello.getHelloWorld()).toEqual('Hello World!');
  });
});