const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(payloadThread) {
    const { content, owner, threadId, commentId } = payloadThread;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date();

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, date, owner, threadId, commentId],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async deleteReplyById(id) {
    const query = {
      text: `UPDATE replies SET is_delete=true WHERE id=$1`,
      values: [id],
    };

    await this._pool.query(query);
  }

  async getReplyById(id) {
    const query = {
      text: `SELECT * FROM replies WHERE id=$1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Reply id tidak ditemukan')
    }

    return result.rows[0];
  }

  async verifyReplyOwner(id, owner) {
    const query = {
      text: `SELECT * FROM replies WHERE id=$1 AND owner=$2`,
      values: [id, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Anda tidak memiliki akses untuk comment ini')
    }

    return result.rows[0];
  }
}

module.exports = ReplyRepositoryPostgres;
