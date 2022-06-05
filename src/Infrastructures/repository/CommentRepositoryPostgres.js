const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const CommentRepository = require("../../Domains/comments/CommentRepository");
const AddedComment = require("../../Domains/comments/entities/AddedComment");
const Comment = require("../../Domains/comments/entities/Comment");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async add(comment, threadId, userId) {
    const id = `comment-${this._idGenerator()}`
    const query = {
      text: 'INSERT INTO comments VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, content, user_id',
      values: [id, comment.content, threadId, new Date(), false, userId],
    };

    const result = await this._pool.query(query);

    return new AddedComment({...result.rows[0]});
  }

  async delete(threadId, commentId) {
    const query = {
      text: 'UPDATE comments set is_deleted = $1 WHERE id = $2 AND thread_id = $3',
      values: [true, commentId, threadId],
    };

    const result = await this._pool.query(query);
    return result.rowCount > 0;
  }

  async getById(commentId) {
    const query = {
      text: 'select ' +
            'comments.id, users.username, comments.date, comments.content, comments.is_deleted ' + 
            'from comments left join users on comments.user_id  = users.id ' + 
            'WHERE comments.id = $1',
      values: [commentId],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount)
      throw new NotFoundError('komentar tidak ditemukan');

    return new Comment({...rows[0]});
  }

  async getByThreadId(threadId) {
    const query = {
      text: 'select ' +
            'comments.id, users.username, comments.date, comments.content, comments.is_deleted ' + 
            'from comments left join users on comments.user_id  = users.id ' + 
            'WHERE comments.thread_id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows.map((row) => new Comment({...row}));
  }

  async verifyCommentOwner(commentId, userId) {
    const rows = await this._pool.query('SELECT * FROM comments WHERE id = $1 AND user_id = $2', [commentId, userId]);
    if (!rows.rowCount)
      throw new AuthorizationError('anda tidak memiliki akses');
    return true;
  }
}

module.exports = CommentRepositoryPostgres;
