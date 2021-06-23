const express = require('express')
const router = express.Router()
const User = require('../../database/models/user')
const passport = require('../../passport')

router.post('/', (req, res) => {
    const { username, password, email } = req.body
    // ADD VALIDATION
    User.findOne({ username: username }, (err, user) => {
        if (err) {
            console.log('User.js post error: ', err)
        } else if (user) {
            res.json({
                error: `Sorry, already a user with the username: ${username}`
            })
        }
        else {
            const newUser = new User({
                username: username,
                email: email,
                password: password
            })
            newUser.save((err, savedUser) => {
                if (err) return res.json(err)
                res.json(savedUser)
            })
        }
    })
})

router.post(
    '/login',
    function (req, res, next) {
        next()
    },
    passport.authenticate('local'),
    (req, res) => {
        console.log('Login successful, logging in as: ', req.user);
        var userInfo = {
            username: req.user.username
        };
        res.send(userInfo);
        
    }
)

router.get('/', (req, res, next) => {
    console.log("User: " + req.user)
    if (req.user) {
        res.json({ user: req.user })
    } else {
        res.json({ user: null })
    }
})

router.post('/logout', (req, res) => {
    if (req.user) {
        req.logout()
        res.send({ msg: 'logging out' })
    } else {
        res.send({ msg: 'no user to log out' })
    }
})

router.put('/saveAnimal', (req, res) => {
    User.updateOne(
        { username: req.body.username },
        { $push: { saved_animals: req.body } },
        function (err, docs) {
            if (err) {
                console.log(err)
            }
            else {
                return docs
            }
        }
    )
    .then(response => {
        res.json(response)
    })
    .catch(error => {
        console.log(error)
    })
})

router.put('/unsaveAnimal', (req, res) => {
    User.updateOne(
        { username: req.body.username },
        { $pull: { saved_animals: req.body.name } },
        function (err, docs) {
            if (err) {
                console.log(err)
            }
            else {
                return docs
            }
        }
    )
    .then(response => {
        res.json(response)
    })
    .catch(error => {
        console.log(error)
    })
})

router.get("/getSavedAnimals", (req, res) => {
    User.findOne(
        {username: req.user.username},
        (err, user) => {
            if (err) {
                console.log(err)
            } else {
                res.json(user.saved_animals)
            }
        }
    )
})

module.exports = router