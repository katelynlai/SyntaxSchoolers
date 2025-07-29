const db = require('../database/connect');

class StaffVocab {
    // CREATE: Add new vocabulary word
    static async createVocabWord(lang1Word, lang2Word, categoryId) {
        try {
            const query = `
                INSERT INTO vocab (lang1_word, lang2_word, category_id)
                VALUES ($1, $2, $3)
                RETURNING *
            `;
            
            const result = await db.query(query, [lang1Word, lang2Word, categoryId]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating vocabulary word: ${error.message}`);
        }
    }

    // READ: Get all vocabulary words with pagination
    static async getAllVocabWords(page = 1, limit = 50, categoryFilter = null) {
        try {
            const offset = (page - 1) * limit;
            
            let query = `
                SELECT 
                    v.vocab_id,
                    v.lang1_word,
                    v.lang2_word,
                    v.category_id,
                    c.category_name
                FROM vocab v
                JOIN category c ON v.category_id = c.category_id
            `;
            
            const params = [];
            
            if (categoryFilter) {
                query += ` WHERE v.category_id = $1`;
                params.push(categoryFilter);
                query += ` ORDER BY v.vocab_id DESC LIMIT $2 OFFSET $3`;
                params.push(limit, offset);
            } else {
                query += ` ORDER BY v.vocab_id DESC LIMIT $1 OFFSET $2`;
                params.push(limit, offset);
            }
            
            const result = await db.query(query, params);
            
            // Get total count for pagination
            const countQuery = categoryFilter ? 
                `SELECT COUNT(*) FROM vocab WHERE category_id = $1` :
                `SELECT COUNT(*) FROM vocab`;
            const countParams = categoryFilter ? [categoryFilter] : [];
            const countResult = await db.query(countQuery, countParams);
            
            return {
                words: result.rows,
                totalCount: parseInt(countResult.rows[0].count),
                currentPage: page,
                totalPages: Math.ceil(countResult.rows[0].count / limit)
            };
        } catch (error) {
            throw new Error(`Error fetching vocabulary words: ${error.message}`);
        }
    }

    // READ: Get vocabulary word by ID
    static async getVocabWordById(vocabId) {
        try {
            const query = `
                SELECT 
                    v.vocab_id,
                    v.lang1_word,
                    v.lang2_word,
                    v.category_id,
                    c.category_name
                FROM vocab v
                JOIN category c ON v.category_id = c.category_id
                WHERE v.vocab_id = $1
            `;
            
            const result = await db.query(query, [vocabId]);
            
            if (result.rows.length === 0) {
                return null;
            }
            
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error fetching vocabulary word: ${error.message}`);
        }
    }

    // UPDATE: Update vocabulary word
    static async updateVocabWord(vocabId, lang1Word, lang2Word, categoryId) {
        try {
            const query = `
                UPDATE vocab 
                SET lang1_word = $2, lang2_word = $3, category_id = $4
                WHERE vocab_id = $1
                RETURNING *
            `;
            
            const result = await db.query(query, [vocabId, lang1Word, lang2Word, categoryId]);
            
            if (result.rows.length === 0) {
                throw new Error('Vocabulary word not found');
            }
            
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error updating vocabulary word: ${error.message}`);
        }
    }

    // DELETE: Remove vocabulary word
    static async deleteVocabWord(vocabId) {
        try {
            const query = `DELETE FROM vocab WHERE vocab_id = $1 RETURNING *`;
            const result = await db.query(query, [vocabId]);
            
            if (result.rows.length === 0) {
                throw new Error('Vocabulary word not found');
            }
            
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error deleting vocabulary word: ${error.message}`);
        }
    }

    // READ: Get all categories
    static async getAllCategories() {
        try {
            const query = `
                SELECT 
                    c.category_id,
                    c.category_name,
                    COUNT(v.vocab_id) as word_count
                FROM category c
                LEFT JOIN vocab v ON c.category_id = v.category_id
                GROUP BY c.category_id, c.category_name
                ORDER BY c.category_name
            `;
            
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching categories: ${error.message}`);
        }
    }

    // CREATE: Add new category
    static async createCategory(categoryName) {
        try {
            const query = `
                INSERT INTO category (category_name)
                VALUES ($1)
                RETURNING *
            `;
            
            const result = await db.query(query, [categoryName]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating category: ${error.message}`);
        }
    }

    // UPDATE: Update category name
    static async updateCategory(categoryId, categoryName) {
        try {
            const query = `
                UPDATE category 
                SET category_name = $2
                WHERE category_id = $1
                RETURNING *
            `;
            
            const result = await db.query(query, [categoryId, categoryName]);
            
            if (result.rows.length === 0) {
                throw new Error('Category not found');
            }
            
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error updating category: ${error.message}`);
        }
    }

    // DELETE: Remove category 
    static async deleteCategory(categoryId) {
        try {
            // Check if category has any words
            const checkQuery = `SELECT COUNT(*) FROM vocab WHERE category_id = $1`;
            const checkResult = await db.query(checkQuery, [categoryId]);
            
            if (parseInt(checkResult.rows[0].count) > 0) {
                throw new Error('Cannot delete category that contains vocabulary words');
            }
            
            const query = `DELETE FROM category WHERE category_id = $1 RETURNING *`;
            const result = await db.query(query, [categoryId]);
            
            if (result.rows.length === 0) {
                throw new Error('Category not found');
            }
            
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error deleting category: ${error.message}`);
        }
    }

    // UTILITY: Search vocabulary words
    static async searchVocabWords(searchTerm, categoryFilter = null) {
        try {
            let query = `
                SELECT 
                    v.vocab_id,
                    v.lang1_word,
                    v.lang2_word,
                    v.category_id,
                    c.category_name
                FROM vocab v
                JOIN category c ON v.category_id = c.category_id
                WHERE (v.lang1_word ILIKE $1 OR v.lang2_word ILIKE $1)
            `;
            
            const params = [`%${searchTerm}%`];
            
            if (categoryFilter) {
                query += ` AND v.category_id = $2`;
                params.push(categoryFilter);
            }
            
            query += ` ORDER BY v.vocab_id DESC`;
            
            const result = await db.query(query, params);
            return result.rows;
        } catch (error) {
            throw new Error(`Error searching vocabulary words: ${error.message}`);
        }
    }
}

module.exports = StaffVocab;
