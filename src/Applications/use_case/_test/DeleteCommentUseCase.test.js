const CommentRepository = require("../../../Domains/comments/CommentRepository");
const Comment = require("../../../Domains/comments/entities/Comment");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const mockCommentRepository = new CommentRepository();
    
    mockCommentRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve(
        new Comment({
          id: 'comment-123',
          username: 'username',
          date: new Date(),
          content: 'content'
      })
    ));

    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve(true));

    mockCommentRepository.delete = jest.fn()
      .mockImplementation(() => Promise.resolve(true));

    const deleteCommentUseCase = new DeleteCommentUseCase({commentRepository: mockCommentRepository});

    // Action
    const isDeleted = await deleteCommentUseCase.execute('thread-123', 'comment-123', 'user-321');

    // Assert
    expect(isDeleted).toStrictEqual(true);
  });
});