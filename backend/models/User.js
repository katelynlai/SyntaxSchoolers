const db = require('../database/connect');
const bcrypt = require('bcrypt');

class User {
    constructor(userData) {
        this.id = userData.user_id;
        this.username = userData.username;
        this.email = userData.email;
        this.password = userData.password;
        this.firstName = userData.first_name;
        this.lastName = userData.last_name;
        this.role = userData.role || 'Student'; // 'Student' or 'staff'
    }

    // Create a new user
    static async create(userData) {
        try {
            // Hash password before storing
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

            const query = `
                INSERT INTO users (username, email, password, first_name, last_name, role)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            `;
            
            const values = [
                userData.username,
                userData.email,
                hashedPassword,
                userData.firstName,
                userData.lastName,
                userData.role || 'Student'
            ];

            const result = await db.query(query, values);
            return new User(result.rows[0]);
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    // Find user by ID
    static async findById(id) {
        try {
            const query = 'SELECT * FROM users WHERE user_id = $1';
            const result = await db.query(query, [id]);
            
            if (result.rows.length === 0) {
                return null;
            }
            
            return new User(result.rows[0]);
        } catch (error) {
            throw new Error(`Error finding user by ID: ${error.message}`);
        }
    }

    // Find user by email
    static async findByEmail(email) {
        try {
            const query = 'SELECT * FROM users WHERE email = $1';
            const result = await db.query(query, [email]);
            
            if (result.rows.length === 0) {
                return null;
            }
            
            return new User(result.rows[0]);
        } catch (error) {
            throw new Error(`Error finding user by email: ${error.message}`);
        }
    }

    // Find user by username
    static async findByUsername(username) {
        try {
            const query = 'SELECT * FROM users WHERE username = $1';
            const result = await db.query(query, [username]);
            
            if (result.rows.length === 0) {
                return null;
            }
            
            return new User(result.rows[0]);
        } catch (error) {
            throw new Error(`Error finding user by username: ${error.message}`);
        }
    }

    // Get all users (for staff dashboard)
    static async findAll() {
        try {
            const query = 'SELECT * FROM users ORDER BY user_id DESC';
            const result = await db.query(query);
            
            return result.rows.map(row => new User(row));
        } catch (error) {
            throw new Error(`Error fetching all users: ${error.message}`);
        }
    }

    // Update user profile
    async updateProfile(updateData) {
        try {
            const allowedFields = ['username', 'email', 'first_name', 'last_name'];
            const updateFields = [];
            const values = [];
            let paramCount = 1;

            // Build dynamic update query
            for (const [key, value] of Object.entries(updateData)) {
                if (allowedFields.includes(key) && value !== undefined) {
                    updateFields.push(`${key} = $${paramCount}`);
                    values.push(value);
                    paramCount++;
                }
            }

            if (updateFields.length === 0) {
                throw new Error('No valid fields to update');
            }

            values.push(this.id);

            const query = `
                UPDATE users 
                SET ${updateFields.join(', ')}
                WHERE user_id = $${paramCount}
                RETURNING *
            `;

            const result = await db.query(query, values);
            
            if (result.rows.length === 0) {
                throw new Error('User not found');
            }

            // Update current instance with new data
            const updatedUser = result.rows[0];
            this.username = updatedUser.username;
            this.email = updatedUser.email;
            this.firstName = updatedUser.first_name;
            this.lastName = updatedUser.last_name;

            return this;
        } catch (error) {
            throw new Error(`Error updating user profile: ${error.message}`);
        }
    }

    // Verify password
    async verifyPassword(password) {
        try {
            return await bcrypt.compare(password, this.password);
        } catch (error) {
            throw new Error(`Error verifying password: ${error.message}`);
        }
    }

    // Change password
    async changePassword(newPassword) {
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

            const query = `
                UPDATE users 
                SET password = $1
                WHERE user_id = $2
                RETURNING user_id
            `;

            const result = await db.query(query, [hashedPassword, this.id]);
            
            if (result.rows.length === 0) {
                throw new Error('User not found');
            }

            this.password = hashedPassword;
            return true;
        } catch (error) {
            throw new Error(`Error changing password: ${error.message}`);
        }
    }

    toJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            role: this.role
        };
    }
}

module.exports = User;
