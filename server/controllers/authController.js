const bcrypt = require('bcryptjs')

module.exports = {
    register: async (req, res) => {

        const db = req.app.get('db');

        const { username, password, isAdmin } = req.body;

        try {
            const result = await db.get_user([username]);
            const existingUser = result[0];

            if (existingUser) {
                return res.status(409).send('Username taken')
            }

            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)

            const registeredUser = await db.register_user([isAdmin, username, hash])

            const user = registeredUser[0];

            req.session.user = { isAdmin: user.is_admin, username: user.username, id: user.id }

            res.status(201).send(registeredUser)
        }
        catch (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    },

}