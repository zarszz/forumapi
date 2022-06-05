class Threads {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.body = payload.body;
    this.date = payload.date.toISOString();
    this.username = payload.username;
    this.comments = payload.comments ? payload.comments : [];
  }

  _verifyPayload(payload) {
    const { id, title, body, date, username } = payload;
    if (!title || !id  || !body || !date || !username) {
      throw new Error('THREADS.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof id !== 'string' || typeof username !== 'string' || typeof body !== 'string' || !date instanceof Date || typeof username !== 'string') {
      throw new Error('THREADS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Threads;
