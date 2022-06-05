class Comment {
    constructor(payload) {
      this._verifyPayload(payload);
  
      this.id = payload.id;
      this.username = payload.username;
      this.date = payload.date.toISOString();
      this.content = payload.content;      
    }
  
    _verifyPayload(payload) {
      const { id, username, date, content, is_deleted } = payload;

      if (is_deleted)
        payload.content = "**komentar telah dihapus**";
  
      if ( !id || !username || !date || !content) {
        throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
      }
  
      if (typeof content !== 'string' || typeof id !== 'string' || typeof username !== 'string' || !date instanceof Date) {
        throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    }
  }
  
  module.exports = Comment;
  