const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const ThreadRepository = require('../ThreadRepositoryPostgres');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {

  beforeEach(async () => {
    await UsersTableTestHelper.addUser(
      { 
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
        id: 'user-321'
      }
    );
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });


  describe('add function', () => {
    it('should persist new thread and return created thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'asdadasda',
        body: 'asdada',
      });
      const idGenerator = () => '123';
      const threadRepository = new ThreadRepository(pool, idGenerator);

      // Action
      await threadRepository.add(newThread, 'user-321');

      // Assert
      const threads = await ThreadsTableTestHelper.findByThreadId('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return registered thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'asd',
        body: 'asd',
      });
      const idGenerator = () => '123';
      const threadRepository = new ThreadRepository(pool, idGenerator);

      // Action
      const createdUser = await threadRepository.add(newThread, 'user-321');

      // Assert
      expect(createdUser).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'asd',
        user_id: 'user-321',
      }));
    });
  });

  describe('getById function', () => {
    it('should return thread if thread exists', async () => {
      await ThreadsTableTestHelper.add({
        id: 'thread-123',
        body: 'asd',
        title: 'asd',
        owner: 'user-321',
      });

      const idGenerator = () => '123';
      const threadRepository = new ThreadRepository(pool, idGenerator);

      const thread = await threadRepository.getById('thread-123');

      expect(thread).not.toBeNull();
      expect(thread.id).toEqual('thread-123');
    });

    it('should throw NotFoundError if thread does not exist', async () => {
      const idGenerator = () => '123';
      const threadRepository = new ThreadRepository(pool, idGenerator);

      await expect(threadRepository.getById('thread-456')).rejects.toThrowError(NotFoundError);
    });
  });
});
