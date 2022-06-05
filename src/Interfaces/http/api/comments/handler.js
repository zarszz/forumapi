const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUseCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase");

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.addCommentHandler = this.addCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async addCommentHandler(request, h) {
    const addCommentUsecase = this._container.getInstance(AddCommentUseCase.name);
    const { id: userId } = request.auth.credentials;
    const { threadId } = request.params;
    const addedComment = await addCommentUsecase.execute(request.payload, threadId, userId);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: userId } = request.auth.credentials;
    const deleteCommentUsecase = this._container.getInstance(DeleteCommentUseCase.name);
    
    await deleteCommentUsecase.execute(threadId, commentId, userId);

    const response = h.response({status: 'success',});
    response.code(200);
    return response;
  }
}

module.exports = CommentsHandler;
