const express = require("express")
const ResponseError = require("./response-error")
const handler = require("./handler")

const router = express.Router()

router.use(express.json())

// Owner API
router.post("/owners", handler.createOwner)
router.get("/owners", handler.getAllOwners)
router.get("/owners/:idOwner", handler.getOwnerById)
router.patch("/owners/:idOwner", handler.editOwner)


// Book API
router.post("/owners/:idOwner/books", handler.createBook)
router.get("/owners/:idOwner/books", handler.getAllBooks)
router.get("/owners/:idOwner/books/:idBook", handler.getBookById)
router.patch("/owners/:idOwner/books/:idBook", handler.editBook)
router.put("/owners/:idOwner/books/:idBook", handler.editBookStatus)
router.delete("/owners/:idOwner/books/:idBook", handler.removeBook)


// Error Middleware
router.use(async (err, req, res, next) => {
    if(!err) {
        next()
        return
    }

    if (err instanceof ResponseError) {
        res.status(err.status).json({
            data: null,
            errors: err.message,
        })
    } else {
        res.status(500).json({
            data: null,
            errors: err.message,
        })
    }
})

module.exports = router