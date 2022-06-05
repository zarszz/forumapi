const NewComment = require("../../Domains/comments/entities/NewComment");

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepositoryy = threadRepository;
  }

  async execute(useCasePayload, threadId, userId) {
    const newComment = new NewComment(useCasePayload);
    await this._threadRepositoryy.getById(threadId)
    return this._commentRepository.add(newComment, threadId, userId);
  }
}

module.exports = AddCommentUseCase;
