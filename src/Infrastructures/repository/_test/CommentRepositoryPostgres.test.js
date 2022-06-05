const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {

  beforeEach(async () => {
    await UsersTableTestHelper.addUser(
      { 
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
        id: 'user-321'
      }
    );
    await ThreadsTableTestHelper.add(
      {
        id: 'thread-123',
        title: 'asdadasda',
        body: 'asdada',
        owner: 'user-321',
      })
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('add function', () => {
    it('should persist new comment and return created comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'asdadasda',
      });
      const idGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, idGenerator);

      // Action
      await commentRepository.add(newComment, 'thread-123', 'user-321');

      // Assert
      const comments = await CommentsTableTestHelper.findByCommentId('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return registered comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'asd'
      });
      const idGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, idGenerator);

      // Action
      const createdComment = await commentRepository.add(newComment, 'thread-123', 'user-321');

      // Assert
      expect(createdComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'asd',
        user_id: 'user-321',
      }));
    });
  });
  describe('delete function', () => {
    it('should delete comment correctly', async () => {
      // Arrange
      const idGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, idGenerator);

      await CommentsTableTestHelper.add({
        id: 'comment-123',
        content: 'asd',
        threadId: 'thread-123',
        userId: 'user-321',
      })

      // Action
      const isDeleted = await commentRepository.delete('thread-123', 'comment-123');

      // Assert
      expect(isDeleted).toStrictEqual(true);
    });

    it('should not delete comment that not exist', async () => {
      // Arrange
      const idGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, idGenerator);

      await CommentsTableTestHelper.add({
        id: 'comment-123',
        content: 'asd',
        threadId: 'thread-123',
        userId: 'user-321',
      })

      // Action
      const isDeleted = await commentRepository.delete('thread-123', 'comment-321');

      // Assert
      expect(isDeleted).toStrictEqual(false);
    });
  });

  describe('getById function', () => {
    it('should return comment correctly', async () => {
      // Arrange
      const idGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, idGenerator);

      await CommentsTableTestHelper.add({
        id: 'comment-123',
        content: 'asd',
        threadId: 'thread-123',
        userId: 'user-321',
      });

      // Action
      const comment = await commentRepository.getById('comment-123');

      // Assert
      expect(comment.id).toEqual('comment-123');
      expect(comment.content).toEqual('asd');
      expect(comment.username).toEqual('dicoding');
    });

    it('should return correctly when comment deleted', async () => {
      // Arrange
      const idGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, idGenerator);

      await CommentsTableTestHelper.add({
        id: 'comment-123',
        content: 'asd',
        threadId: 'thread-123',
        userId: 'user-321',
      });

      // Action
      await commentRepository.delete('thread-123', 'comment-123');

      const comments = await commentRepository.getByThreadId('thread-123');

      // Assert
      expect(comments).toHaveLength(1);
      expect(comments[0].content).toEqual('**komentar telah dihapus**')
    });

    it('should throw NotFoundError when comment no exist', async () => {
      // Arrange
      const idGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, idGenerator);

      await CommentsTableTestHelper.add({
        id: 'comment-123',
        content: 'asd',
        threadId: 'thread-123',
        userId: 'user-321',
      })

      // Action
      await expect(commentRepository.getById('comment-44444')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('getByThreadId function', () => {
    it('should return comments correctly', async () => {
      await CommentsTableTestHelper.add({
        id: 'comment-123',
        content: 'asdxx',
        threadId: 'thread-123',
        userId: 'user-321',
      });
      await CommentsTableTestHelper.add({
        id: 'comment-1234',
        content: 'asdxx',
        threadId: 'thread-123',
        userId: 'user-321',
      });
      const idGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, idGenerator);
      const comments = await commentRepository.getByThreadId('thread-123');
      expect(comments.length > 0).toBeTruthy();
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should return true when given data is correct', async () => {
      await CommentsTableTestHelper.add({
        id: 'comment-123',
        content: 'asd',
        threadId: 'thread-123',
        userId: 'user-321',
      });
      const idGenerator = () => '123';
      
      const commentRepository = new CommentRepositoryPostgres(pool, idGenerator);
      const isTrue = await commentRepository.verifyCommentOwner('comment-123', 'user-321');

      expect(isTrue).toBeTruthy();
    });

    it('should throw AuthorizationError when given data is incorrect', async () => {
      const idGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, idGenerator);

      await expect(commentRepository.verifyCommentOwner('comment-123', 'user-553')).rejects.toThrowError(AuthorizationError);
    });
  });  
});