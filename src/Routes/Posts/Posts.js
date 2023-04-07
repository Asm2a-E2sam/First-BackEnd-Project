const Router = require("express").Router();
const db = require("../../../mysql-connector");
const { query_runner, create_error_object, done } = require("../../helpers/db-functions");

Router.get("/", (req, res) => {
        query_runner("SELECT * FROM posts")
                .then(rows => res.status(200).json(rows))
                .catch(err => res.status(500).json(create_error_object("db_error", err.message)))
});

Router.post("/", (req, res) => {
        const data = [
                req.body.title,
                req.body.content,
                req.body.author_id
        ];
        query_runner("INSERT INTO posts \
        (title, content, author_id) \
        VALUES (?, ?, ?)", data)
                .then(row => res.status(200).json(row))
                .catch(err => res.status(500).json(create_error_object("db_error", err.message)))
});

Router.delete("/:id", (req, res) => {
        query_runner("DELETE FROM posts WHERE id = ?", [req.params.id])
                .then( ({affectedRows}) => res.status(200).json(affectedRows > 0 
                                                                        ? done("Post deleted successfully") 
                                                                        : done("Post doesn't exist")))
                .catch(err => res.status(500)
                                        .json(create_error_object("db_error", err.message)));
})

Router.patch("/:id", (req, res) => {
    const data = [req.body.title, req.body.content]
    query_runner("UPDATE posts SET title = ?, content = ? WHERE id = ?", [...data, req.params.id])
    .then((rows) => {res.status(200).json(rows)})
    .catch((err) => {res.sendStatus(500).json(create_error_object("db_error", err.message))});
})

module.exports = Router;