const Threads = require('../Threads');

describe('Threads entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'asda',
    };

    // Action & Assert
    expect(() => new Threads(payload)).toThrowError('THREADS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'asdas',
      title: 'xxxxxxxxxxxxxxxxxxxxx',
      body: '123131312',
      date: new Date(),
      username: [],
      comments: []
    };

    // Action & Assert
    expect(() => new Threads(payload)).toThrowError('THREADS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should still create Threads entities with empty comments when comments data not given', () => {
    // Arrange
    const payload = {
      id: 'asdas',
      title: 'xxxxxxxxxxxxxxxxxxxxx',
      body: '123131312',
      date: new Date(),
      username: 'asdad',
    };

    // Action
    const threads = new Threads(payload);

    // Assert
    expect(threads.comments.length === 0).toBeTruthy();
  });

  it('should create Threads entities correctly', () => {
    // Arrange
    const payload = {
      id: 'asdas',
      title: 'xxxxxxxxxxxxxxxxxxxxx',
      body: '123131312',
      date: new Date(),
      username: 'asdad',
      comments: [],
    };

    // Action
    const threads = new Threads(payload);

    // Assert
    expect(threads).toBeInstanceOf(Threads);
  });
});
