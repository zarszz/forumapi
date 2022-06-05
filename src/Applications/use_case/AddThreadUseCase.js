const NewThread = require('../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, userId) {
    const newThread = new NewThread(useCasePayload);
    return this._threadRepository.add(newThread, userId);
  }
}

module.exports = AddThreadUseCase;
