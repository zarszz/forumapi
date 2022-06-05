const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const NewComment = require("../../../Domains/comments/entities/NewComment");
const Threads = require("../../../Domains/threads/entities/Threads");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddCommentUseCase = require("../AddCommentUseCase");

describe('AddCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'dicoding',
    };
    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'asd',
      user_id: 'user-321',
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockCommentRepository.add = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedComment({
        id: 'comment-123',
        content: 'asd',
        user_id: 'user-321',
      })));

    mockThreadRepository.getById = jest.fn()
    .mockImplementation(() => Promise.resolve(new Threads({
      id: 'thread-123',
      title: 'title',
      body: 'body',
      date: new Date(),
      username: 'username',
      comments: [],
    })));

    /** creating use case instance */
    const getCommentUsecase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository
    });

    // Action
    const addedComment = await getCommentUsecase.execute(useCasePayload, 'thread-123', 'user-321');

    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockCommentRepository.add).toBeCalledWith(new NewComment({
      content: useCasePayload.content,
    }), 'thread-123', 'user-321');
  });
});
