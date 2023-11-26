
const query = require("./db-connection")
const ResponseError = require("./response-error")

const createOwner = async (req, res, next) => {
    try {
        const { name, phone } = req.body
        if (!name || !phone) {
            throw new ResponseError(400, "Name and Phone is required.")
        }

        const owner = await query("SELECT * FROM owners WHERE phone = ?", phone)
        if (owner[0].length > 0) {
            throw new ResponseError(409, "Phone already exist.")
        }

        const result = await query("INSERT INTO owners (name, phone) VALUES (?, ?)", name, phone)
        const data = {
            id: result[0].insertId,
            name,
            phone
        }
        res.status(200).json({
            data,
            errors: null
        })
    } catch (error) {
        next(error)
    }
}

const getAllOwners = async (req, res, next) => {
    try {
        const result = await query("SELECT * FROM owners")
        return res.status(200).json({
            data: result[0],
            errors: null
        })
    } catch (error) {
        next(error)
    }
}

const getOwnerById = async (req, res, next) => {
    try {
        const { idOwner } = req.params

        const result = await query("SELECT * FROM owners WHERE id = ?", idOwner)
        if(result[0].length === 0 ) {
            throw new ResponseError(404, "Id Owner is not found.")
        }
        const data = result[0][0]
        return res.status(200).json({
            data,
            errors: null
        })
    } catch (error) {
        next(error)
    }
}

const editOwner = async (req, res, next) => {
    try {
        const { idOwner } = req.params
        console.log(idOwner)
        let owner = await query("SELECT * FROM owners WHERE id = ?", idOwner)
        if (owner[0].length === 0) {
            throw new ResponseError(404, "Id Owner is not found.")
        }

        const { name, phone } = req.body
        if (!name || !phone) {
            throw new ResponseError(400, "Name and Phone is required.")
        }

        owner = await query("SELECT * FROM owners WHERE phone = ?", phone)
        if (owner[0].length > 0 && owner[0][0].id !== req.params.idOwner) {
            throw new ResponseError(409, "Phone already exist.")
        }

        await query("UPDATE owners SET name = ?, phone = ? WHERE id = ?", name, phone.idOwner)
        const data = await query("SELECT * FROM owners WHERE id = ?", idOwner)
        res.status(200).json({
            data: data[0][0],
            errors: null
        })
    } catch (error) {
        next(error)
    }
}

const createBook = async (req, res, next) => {
    try {    
        const { idOwner } = req.params
    
        const owner = await query("SELECT * FROM owners WHERE id = ?", idOwner)
        if (owner[0].length === 0) {
            throw new ResponseError(404, "Id Owner is not found.")
        }
    
        const { title, author } = req.body
        if (!title || !author) {
            throw new ResponseError(400, "Title and Author is required.")
        }
    
        const status = "not returned"
    
        const result = await query("INSERT INTO books (title, author, status, id_owner) VALUES (?, ?, ?, ?)", title, author, status, idOwner)
    
        const data = {
            id: result[0].insertId,
            title,
            author,
            status
        }
    
        res.status(200).json({
            data,
            errors: null
        })
    } catch (error) {
        next(error)
    }
}

const getAllBooks = async (req, res, next) => {
    try {
        const { idOwner } = req.params
    
        const owner = await query("SELECT * FROM owners WHERE id = ?", idOwner)
        if (owner[0].length === 0) {
            throw new ResponseError(404, "Id Owner is not found.")
        }

        const result = await query("SELECT * FROM books WHERE id_owner = ?", idOwner)
        return res.status(200).json({
            data: result[0],
            errors: null
        })
    } catch (error) {
        next(error)
    }
}

const getBookById = async (req, res, next) => {
    try {
        const { idOwner } = req.params
    
        const owner = await query("SELECT * FROM owners WHERE id = ?", idOwner)
        if (owner[0].length === 0) {
            throw new ResponseError(404, "Id Owner is not found.")
        }

        const { idBook } = req.params
        const book = await query("SELECT * FROM books WHERE id = ?", idBook)
        if (book[0].length === 0) {
            throw new ResponseError(404, "Id Book is not found.")
        }

        const data = book[0][0]
        res.status(200).json({
            data,
            errors: null
        })
    } catch (error) {
        next(error)
    }
}

const editBook = async (req, res, next) => {
    try {
        const { idOwner } = req.params
        const owner = await query("SELECT * FROM owners WHERE id = ?", idOwner)
        if (owner[0].length === 0) {
            throw new ResponseError(404, "Id Owner is not found.")
        }

        const { idBook } = req.params
        const book = await query("SELECT * FROM books WHERE id = ?", idBook)
        if (book[0].length === 0) {
            throw new ResponseError(404, "Id Book is not found.")
        }

        const { title, author } = req.body
        if (!title || !author) {
            throw new ResponseError(400, "Title and Author is required.")
        }

        await query("UPDATE books SET title = ?, author = ? WHERE id = ?", title, author, idBook)
        const data = await query("SELECT * FROM books WHERE id = ?", idBook)

        res.status(200).json({
            data: data[0][0],
            errors: null
        })
    } catch (error) {
        next(error)
    }
}

const editBookStatus = async (req, res, next) => {
    try {
        const { idOwner } = req.params  
        const owner = await query("SELECT * FROM owners WHERE id = ?", idOwner)
        if (owner[0].length === 0) {
            throw new ResponseError(404, "Id Owner is not found.")
        }

        const { idBook } = req.params
        const book = await query("SELECT * FROM books WHERE id = ?", idBook)
        if (book[0].length === 0) {
            throw new ResponseError(404, "Id Book is not found.")
        }

        let { status } = req.query
        if (!status) {
            throw new ResponseError(400, "Query parameter 'status' is required.")
        }
        if (status != "returned" && status != "not returned") {
            throw new ResponseError(400, "Status must be 'returned' or 'not returned'.")
        }

        await query("UPDATE books SET status = ? WHERE id = ?", status, idBook)
        const data = await query("SELECT * FROM books WHERE id = ?", idBook)

        res.status(200).json({
            data: data[0][0],
            errors: null
        })

    } catch (error) {
        next(error)
    }
}

const removeBook = async (req, res, next) => {
    try {
        const { idOwner } = req.params  
        const owner = await query("SELECT * FROM owners WHERE id = ?", idOwner)
        if (owner[0].length === 0) {
            throw new ResponseError(404, "Id Owner is not found.")
        }

        const { idBook } = req.params
        const book = await query("SELECT * FROM books WHERE id = ?", idBook)
        if (book[0].length === 0) {
            throw new ResponseError(404, "Id Book is not found.")
        }

        await query("DELETE FROM books WHERE id = ?", idBook)

        res.status(201).json({
            data: "OK",
            errors: null
        })
        
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createOwner,
    getAllOwners,
    getOwnerById,
    editOwner,
    createBook,
    getAllBooks,
    getBookById,
    editBook,
    editBookStatus,
    removeBook
}