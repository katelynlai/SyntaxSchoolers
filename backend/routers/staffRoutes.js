const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');

// Vocabulary CRUD routes
router.post('/vocab', staffController.createVocabWord);           
router.get('/vocab', staffController.getAllVocabWords);           
router.get('/vocab/search', staffController.searchVocabWords);    
router.get('/vocab/:id', staffController.getVocabWordById);       
router.put('/vocab/:id', staffController.updateVocabWord);        
router.delete('/vocab/:id', staffController.deleteVocabWord);     

// Category CRUD routes
router.post('/categories', staffController.createCategory);       
router.get('/categories', staffController.getAllCategories);      
router.put('/categories/:id', staffController.updateCategory);    
router.delete('/categories/:id', staffController.deleteCategory); 


// Sentences CRUD routes
router.post('/sentences', staffController.createSentence);           
router.get('/sentences', staffController.getAllSentences);           
router.get('/sentences/:id', staffController.getSentenceById);       
router.put('/sentences/:id', staffController.updateSentence);        
router.delete('/sentences/:id', staffController.deleteSentence);     

module.exports = router;
