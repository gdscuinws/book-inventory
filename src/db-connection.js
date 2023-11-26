const mysql = require("mysql2/promise")

const query = async (sql, ...params) =>{
    const conn = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "book_inventory_db"
    })

    const result = await conn.query(sql, params)
    await conn.end()
    
    return result
}

module.exports = query