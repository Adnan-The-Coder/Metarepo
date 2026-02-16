import { superAuth } from './super-auth';

describe('superAuth', () => {
  it('should work', () => {
    expect(superAuth()).toEqual('super-auth');
  });
});
