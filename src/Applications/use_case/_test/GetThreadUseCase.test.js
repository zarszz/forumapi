const CommentRepository = require("../../../Domains/comments/CommentRepository");
const Comment = require("../../../Domains/comments/entities/Comment");
const Threads = require("../../../Domains/threads/entities/Threads");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const GetThreadUsecase = require("../GetThreadUseCase");

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // membuat date diawal karena sering terjadi gagal walaupun beda millisecond
    const date = new Date();
    const expectedThread = new Threads({
      id: 'thread-123',
      title: 'title',
      body: 'body',
      date,
      username: 'username',
      comments: []
    });

    const expectedComment = new Comment({
      id: 'comment-123',
      username: 'username',
      date,
      content: 'content'
    });

    expectedThread.comments.push(expectedComment);

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getById = jest.fn().mockImplementation(() => Promise.resolve(
      new Threads({
        id: 'thread-123',
        title: 'title',
        body: 'body',
        date,
        username: 'username',
        comments: []
      })
    ));

    mockCommentRepository.getByThreadId = jest.fn().mockImplementation(() => Promise.resolve(
      [
        new Comment({
          id: 'comment-123',
          username: 'username',
          date,
          content: 'content'
        })
      ]
    ));

    const useCase = new GetThreadUsecase({
      threadRepository: mockThreadRepository, 
      commentRepository: mockCommentRepository}
    );

    const thread = await useCase.execute('thread-123');

    expect(thread).toStrictEqual(expectedThread);    
    expect(thread.comments.length > 0).toBeTruthy();
    expect(thread.comments[0]).toStrictEqual(expectedComment);
  });
});