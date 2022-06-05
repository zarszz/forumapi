const AddedThread = require('../AddedThread');

describe('AddedThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'asda',
    };

    // Action & Assert
    expect(() => new AddedThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: '123131',
      title: 'xxxxxxxxxxxxxxxxxxxxx',
      body: 'asdad',
      user_id: 123131312,
    };

    // Action & Assert
    expect(() => new AddedThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedThread entities correctly', () => {
    // Arrange
    const payload = {
      id: '123131',
      title: 'this is title',
      user_id: 'asdadada'
    };

    // Action
    const addedThread = new AddedThread(payload);

    // Assert
    expect(addedThread).toBeInstanceOf(AddedThread);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.owner).toEqual(payload.user_id);
  });
});
