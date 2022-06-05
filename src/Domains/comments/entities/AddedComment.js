class AddedComment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.content = payload.content;
    this.id = payload.id;
    this.owner = payload.user_id;
  }

  _verifyPayload(payload) {
    const { content, id, user_id: owner } = payload;

    if (!content || !id || !owner) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof id !== 'string' || typeof owner !== 'string') {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedComment;
