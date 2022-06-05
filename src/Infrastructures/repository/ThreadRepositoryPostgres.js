const AddedThread = require('../../Domains/threads/entities/AddedThread');
const Threads = require('../../Domains/threads/entities/Threads');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator
  }

  async add(newThread, userId) {
    const { title, body } = newThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, user_id',
      values: [id, title, body, new Date(), userId],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async getById(threadId) {
    const query = {
      text: 'select ' +
            'threads.id, threads.title, threads.body, threads.date, users.username ' + 
            'from threads left join users on threads.user_id  = users.id ' + 
            'WHERE threads.id = $1',
      values: [threadId],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return new Threads(rows[0]);
  }

}

module.exports = ThreadRepositoryPostgres;
