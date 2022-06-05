class GetThreadUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getById(threadId);
    const comments = await this._commentRepository.getByThreadId(threadId);
    thread.comments = comments;
    return thread;
  }

}

module.exports = GetThreadUseCase;
