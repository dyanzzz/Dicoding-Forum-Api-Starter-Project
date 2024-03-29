const AddedComment = require('../AddedComment')

describe('a AddedComment entities', () => {
	it('should throw error when payload did not contain needed property', () => {
		// Arrange
		const payload = {
			id: 'comment-123',
			owner: 'user-123',
		}

		// Action and Assert
		expect(() => new AddedComment(payload)).toThrowError(
			'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
		)
	})

	it('should throw error when payload did not meet data type specification', () => {
		// Arrange
		const payload = {
			id: 'comment-123',
			content: 123,
			owner: 'user-123',
		}

		// Action and Assert
		expect(() => new AddedComment(payload)).toThrowError(
			'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
		)
	})

	it('should create AddedComment object correctly', () => {
		// Arrange
		const payload = {
			id: 'comment-123',
			content: 'dicoding',
			owner: 'user-123',
		}

		// Action
		const { content, owner } = new AddedComment(payload)

		// Assert
		expect(content).toEqual(payload.content)
		expect(owner).toEqual(payload.owner)
	})
})
