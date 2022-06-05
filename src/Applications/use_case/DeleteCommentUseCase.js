class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(threadId, commentId, userId) {
    await this._commentRepository.getById(commentId);
    await this._commentRepository.verifyCommentOwner(commentId, userId);

    return await this._commentRepository.delete(threadId, commentId);
  }
}

module.exports = DeleteCommentUseCase;
