import EventEmitter from '../../app/shared/util/emitter';

describe('test EventEmitter', () => {
  let emitter: EventEmitter;

  beforeEach(() => {
    emitter = new EventEmitter();
  });

  test('should emit an event with data', () => {
    const testFn = jest.fn();
    emitter.subscribe('event', testFn);
    emitter.emit('event', 'test data');
    expect(testFn).toHaveBeenCalledWith('test data');
  });

  test('should not emit when unsubscribed', () => {
    const testFn = jest.fn();
    emitter.subscribe('event', testFn);
    emitter.unsubscribe('event', testFn);
    emitter.emit('event', 'test data');
    expect(testFn).not.toHaveBeenCalled();
  });

  test('should not emit when subscribe to different events', () => {
    const testFn = jest.fn();
    emitter.subscribe('event1', testFn);
    emitter.emit('event2', 'test data');
    expect(testFn).not.toHaveBeenCalled();
  });
});
