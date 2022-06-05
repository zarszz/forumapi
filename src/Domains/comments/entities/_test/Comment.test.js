const Comment = require('../Comment');

describe('Comment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'asda',
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: '123131',
      username: 'dicoding',
      date: new Date(),
      content: 222222222222,
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Comment entities correctly', () => {
    // Arrange
    const payload = {
      id: '123131',
      username: 'dicoding',
      date: new Date(),
      content: '222222222222',
    };

    // Action
    const comment = new Comment(payload);

    // Assert
    expect(comment).toBeInstanceOf(Comment);
    expect(comment.content).toEqual(payload.content);
    expect(comment.id).toEqual(payload.id);
  });

  it('should create Comment entities correctly when comment is deleted', () => {
    // Arrange
    const payload = {
      id: '123131',
      username: 'dicoding',
      date: new Date(),
      content: '222222222222',
      is_deleted: true
    };

    // Action
    const comment = new Comment(payload);

    // Assert
    expect(comment).toBeInstanceOf(Comment);
    expect(comment.content).toEqual("**komentar telah dihapus**");
    expect(comment.id).toEqual(payload.id);
  });
});
