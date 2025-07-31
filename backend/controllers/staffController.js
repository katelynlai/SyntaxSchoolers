// SENTENCES CRUD
const createSentence = async (req, res) => {
    try {
        const { english, french, shuffled, categoryId } = req.body;
        if (!english || !french || !shuffled || !categoryId) {
            return res.status(400).json({ success: false, message: 'english, french, shuffled, and categoryId are required' });
        }
        const newSentence = await StaffVocab.createSentence(english, french, shuffled, categoryId);
        res.status(201).json({ success: true, message: 'Sentence created successfully', data: newSentence });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllSentences = async (req, res) => {
    try {
        const categoryId = req.query.categoryId || null;
        const sentences = await StaffVocab.getAllSentences(categoryId);
        res.json({ success: true, data: sentences });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getSentenceById = async (req, res) => {
    try {
        const { id } = req.params;
        const sentence = await StaffVocab.getSentenceById(id);
        if (!sentence) {
            return res.status(404).json({ success: false, message: 'Sentence not found' });
        }
        res.json({ success: true, data: sentence });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateSentence = async (req, res) => {
    try {
        const { id } = req.params;
        const { english, french, shuffled, categoryId } = req.body;
        if (!english || !french || !shuffled || !categoryId) {
            return res.status(400).json({ success: false, message: 'english, french, shuffled, and categoryId are required' });
        }
        const updatedSentence = await StaffVocab.updateSentence(id, english, french, shuffled, categoryId);
        res.json({ success: true, message: 'Sentence updated successfully', data: updatedSentence });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteSentence = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSentence = await StaffVocab.deleteSentence(id);
        res.json({ success: true, message: 'Sentence deleted successfully', data: deletedSentence });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
const StaffVocab = require('../models/StaffVocab');

// CREATE: Add new vocabulary word
const createVocabWord = async (req, res) => {
    try {
        const { lang1Word, lang2Word, categoryId } = req.body;

        // Validate required fields
        if (!lang1Word || !lang2Word || !categoryId) {
            return res.status(400).json({
                success: false,
                message: 'lang1Word, lang2Word, and categoryId are required'
            });
        }

        const newWord = await StaffVocab.createVocabWord(lang1Word, lang2Word, categoryId);

        res.status(201).json({
            success: true,
            message: 'Vocabulary word created successfully',
            data: newWord
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// READ: Get all vocabulary words with optional pagination
const getAllVocabWords = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || null;
        const limit = parseInt(req.query.limit) || null;
        const categoryFilter = req.query.category || null;

        // If no pagination parameters, get all words
        if (!page && !limit) {
            const result = await StaffVocab.getAllVocabWords(1, 1000, categoryFilter);
            res.json({
                success: true,
                data: result.words  // Just return the words array, not pagination info
            });
        } else {
            const result = await StaffVocab.getAllVocabWords(page || 1, limit || 50, categoryFilter);
            res.json({
                success: true,
                data: result
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// READ: Get vocabulary word by ID
const getVocabWordById = async (req, res) => {
    try {
        const { id } = req.params;
        const word = await StaffVocab.getVocabWordById(id);

        if (!word) {
            return res.status(404).json({
                success: false,
                message: 'Vocabulary word not found'
            });
        }

        res.json({
            success: true,
            data: word
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE: Update vocabulary word
const updateVocabWord = async (req, res) => {
    try {
        const { id } = req.params;
        const { lang1Word, lang2Word, categoryId } = req.body;

        // Validate required fields
        if (!lang1Word || !lang2Word || !categoryId) {
            return res.status(400).json({
                success: false,
                message: 'lang1Word, lang2Word, and categoryId are required'
            });
        }

        const updatedWord = await StaffVocab.updateVocabWord(id, lang1Word, lang2Word, categoryId);

        res.json({
            success: true,
            message: 'Vocabulary word updated successfully',
            data: updatedWord
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE: Remove vocabulary word
const deleteVocabWord = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedWord = await StaffVocab.deleteVocabWord(id);

        res.json({
            success: true,
            message: 'Vocabulary word deleted successfully',
            data: deletedWord
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// READ: Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await StaffVocab.getAllCategories();

        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// CREATE: Add new category
const createCategory = async (req, res) => {
    try {
        const { categoryName } = req.body;

        if (!categoryName) {
            return res.status(400).json({
                success: false,
                message: 'categoryName is required'
            });
        }

        const newCategory = await StaffVocab.createCategory(categoryName);

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: newCategory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE: Update category
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryName } = req.body;

        if (!categoryName) {
            return res.status(400).json({
                success: false,
                message: 'categoryName is required'
            });
        }

        const updatedCategory = await StaffVocab.updateCategory(id, categoryName);

        res.json({
            success: true,
            message: 'Category updated successfully',
            data: updatedCategory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE: Remove category
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await StaffVocab.deleteCategory(id);

        res.json({
            success: true,
            message: 'Category deleted successfully',
            data: deletedCategory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UTILITY: Search vocabulary words
const searchVocabWords = async (req, res) => {
    try {
        const { q, category } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query (q) is required'
            });
        }

        const results = await StaffVocab.searchVocabWords(q, category);

        res.json({
            success: true,
            data: results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createVocabWord, getAllVocabWords,
    getVocabWordById, updateVocabWord,
    deleteVocabWord, getAllCategories,
    createCategory, updateCategory,
    deleteCategory, searchVocabWords,
    // Sentences CRUD
    createSentence, getAllSentences,
    getSentenceById, updateSentence,
    deleteSentence
};