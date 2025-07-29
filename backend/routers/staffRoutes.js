const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');

// Vocabulary CRUD routes
router.post('/vocab', staffController.createVocabWord);           // CREATE vocabulary word
router.get('/vocab', staffController.getAllVocabWords);           // READ all vocabulary words (with pagination)
router.get('/vocab/search', staffController.searchVocabWords);    // SEARCH vocabulary words
router.get('/vocab/:id', staffController.getVocabWordById);       // READ specific vocabulary word
router.put('/vocab/:id', staffController.updateVocabWord);        // UPDATE vocabulary word
router.delete('/vocab/:id', staffController.deleteVocabWord);     // DELETE vocabulary word

// Category CRUD routes
router.post('/categories', staffController.createCategory);       // CREATE category
router.get('/categories', staffController.getAllCategories);      // READ all categories
router.put('/categories/:id', staffController.updateCategory);    // UPDATE category
router.delete('/categories/:id', staffController.deleteCategory); // DELETE category

module.exports = router;
