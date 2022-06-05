const AddedComment = require('../AddedComment');

describe('AddedComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'asda',
    };

    // Action & Assert
    expect(() => new AddedComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: '123131',
      content: 'xxxxxxxxxxxxxxxxxxxxx',
      user_id: 123131312,
    };

    // Action & Assert
    expect(() => new AddedComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedComment entities correctly', () => {
    // Arrange
    const payload = {
      id: '123131',
      content: 'this is title',
      user_id: 'asdadada'
    };

    // Action
    const addedComment = new AddedComment(payload);

    // Assert
    expect(addedComment).toBeInstanceOf(AddedComment);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.owner).toEqual(payload.user_id);
  });
});
