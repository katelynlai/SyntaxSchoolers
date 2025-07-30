const db = require('../database/connect');

class User {
    constructor({ user_id, first_name, surname, username, password, role}) {
        this.id = user_id;
        this.first_name = first_name
        this.surname = surname
        this.username = username;
        this.password = password;
        this.role = role;
    }


    static async getOneById(id) {
        const response = await db.query("SELECT * FROM users WHERE user_id = $1", [id]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate user.");
        }
        return new User(response.rows[0]);
    }


    static async getOneByUsername(username) {
        const response = await db.query("SELECT * FROM users WHERE username = $1", [username]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate user.");
        }
        return new User(response.rows[0]);
    }

    static async create(data) {
        const { firstname, surname, username, password, role } = data;
    
        const response = await db.query(
            `INSERT INTO users (first_name, surname, username, password, role)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING user_id;`,
            [firstname, surname, username, password, role]
        );
    
        const newId = response.rows[0].user_id;
        const newUser = await User.getOneById(newId);
        return newUser;
    }
}


module.exports = User;