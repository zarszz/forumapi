class AddedThread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.title = payload.title;
    this.id = payload.id;
    this.owner = payload.user_id;
  }

  _verifyPayload(payload) {
    const { title, id, user_id: owner } = payload;

    if (!title || !id || !owner) {
      throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof id !== 'string' || typeof owner !== 'string') {
      throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedThread;
