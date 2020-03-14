const express = require('express');
const db = require('../data/db');
const router = express.Router();

router.post('/', (req, res) => {
	const newPost = req.body;
	if (typeof newPost.title === 'undefined' || typeof newPost.contents === 'undefined') {
		res
			.status(400)
			.json({ errorMessage: 'Please provide title and contents for the post.' });
	} else {
		db.insert(newPost)
			.then(addedPost => {
				res.status(201).json(addedPost);
			})
			.catch(err => {
				res
					.status(500)
					.json({ error: 'There was an error while saving the post to the database' });
			});
	}
});

router.post('/:id/comments', (req, res) => {
	const { id } = req.params;
	const newComment = { ...req.body, post_id: id };
	if (typeof newComment.text === 'undefined') {
		res.status(400).json({ errorMessage: 'Please provide text for the comment.' });
	} else {
		db.insertComment(newComment)
			.then(addedComment => {
				if (addedComment) {
					res.status(201).json(addedComment);
				} else {
					res
						.status(404)
						.json({ message: 'The post with the specified ID does not exist.' });
				}
			})
			.catch(err => {
				res
					.status(500)
					.json({ error: 'There was an error while saving the comment to the database' });
			});
	}
});

router.get('/', (req, res) => {
	db.find()
		.then(posts => {
			res.status(200).json(posts);
		})
		.catch(err => {
			res.status(500).json({ error: 'The posts information could not be retrieved.' });
		});
});

router.get('/:id', (req, res) => {
	db.findById(req.params.id)
		.then(post => {
			if (post) {
				res.status(200).json(post);
			} else {
				res
					.status(404)
					.json({ message: 'The post with the specified ID does not exist.' });
			}
		})
		.catch(err => {
			res.status(500).json({ error: 'The post information could not be retrieved.' });
		});
});

router.get('/:id/comments', (req, res) => {
	const { id } = req.params;
	db.findPostComments(id)
		.then(comments => {
			if (comments) {
				res.status(200).json(comments);
			} else {
				res
					.status(404)
					.json({ message: 'The post with the specified ID does not exist.' });
			}
		})
		.catch(err => {
			res.status(500).json({ error: 'The comments information could not be retrieved.' });
		});
});

router.delete('/:id', (req, res) => {
	const { id } = req.params;
	console.log(req.params);
	db.remove(id)
		.then(deletedPost => {
			if (deletedPost) {
				res.status(204).json({ message: 'Post has been deleted.' });
			} else {
				res
					.status(404)
					.json({ message: 'The post with the specified ID does not exist.' });
			}
		})
		.catch(err => {
			res.status(500).json({ error: 'The post could not be removed' });
		});
});

router.put('/:id', (req, res) => {
	const { id } = req.params;
	const editPost = req.body;
	if (typeof editPost.title === 'undefined' || typeof editPost.contents === 'undefined') {
		res
			.status(400)
			.json({ errorMessage: 'Please provide title and contents for the post.' });
	} else {
		db.update(id, editPost)
			.then(updatedPost => {
				if (updatedPost) {
					res.status(200).json({ updatedPost });
				} else {
					res
						.status(404)
						.json({ message: 'The post with the specified ID does not exist.' });
				}
			})
			.catch(err => {
				res.status(500).json({ error: 'The post information could not be modified.' });
			});
	}
});

module.exports = router;
