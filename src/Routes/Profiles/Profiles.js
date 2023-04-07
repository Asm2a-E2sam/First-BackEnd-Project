const Router = require("express").Router();
const db = require("../../../mysql-connector");
const { query_runner, create_error_object, done } = require("../../helpers/db-functions");

Router.get("/", (req, res) => {
        query_runner("SELECT * FROM author_profile")
                .then(rows => res.status(200).json(rows))
                .catch(err => res.status(500).json(create_error_object("db_error", err.message)))
});

Router.post("/", (req, res) => {
        const data = [
                req.body.author_id,
                req.body.website,
                req.body.facebook,
                req.body.twitter
        ];
        query_runner("INSERT INTO author_profile \
        (author_id, website, facebook, twitter) \
        VALUES (?, ?, ?, ?)", data)
                .then(row => res.status(200).json(row))
                .catch(err => res.status(500).json(create_error_object("db_error", err.message)))
});

Router.delete("/:id", (req, res) => {
        query_runner("DELETE FROM author_profile WHERE id = ?", [req.params.id])
                .then( ({affectedRows}) => res.status(200).json(affectedRows > 0 
                                                                        ? done("Profile deleted successfully") 
                                                                        : done("Profile doesn't exist")))
                .catch(err => res.status(500)
                                        .json(create_error_object("db_error", err.message)));
})

Router.patch("/:id", (req, res) => {
    const data = [req.body.website, req.body.facebook, req.body.twitter]
    query_runner("UPDATE author_profile SET website = ?, facebook = ?, twitter = ? WHERE id = ?", [...data, req.params.id])
    .then((rows) => {res.status(200).json(rows)})
    .catch((err) => {res.sendStatus(500).json(create_error_object("db_error", err.message))});
})

module.exports = Router;