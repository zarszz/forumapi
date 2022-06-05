const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const NewThread = require("../../../Domains/threads/entities/NewThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddThreadUseCase = require("../AddThreadUseCase");

describe('AddThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'dicoding',
      body: 'Dicoding Indonesia',
      user_id: 'user-321',      
    };
    const expectedAddedThread = new AddedThread({
      title: useCasePayload.title,
      user_id: 'user-321',      
      id: 'thread-123',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.add = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedThread));

    /** creating use case instance */
    const getThreadUsecase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,  
    });

    // Action
    const addedThread = await getThreadUsecase.execute(useCasePayload, useCasePayload.user_id);

    // Assert
    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.add).toBeCalledWith(new NewThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
    }), useCasePayload.user_id);
  });
});
