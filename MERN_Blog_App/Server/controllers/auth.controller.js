import User from "../models/user.model.js"
import bcyrptjs from 'bcryptjs'

export const signup = async (req, res)=> {
    const { username, email, password } = req.body
    const salt = bcyrptjs.genSaltSync(10);
    const hashedPassword = bcyrptjs.hashSync(password, salt)
    const newUser = new User({
        username,
        email,
        password: hashedPassword
    })
    try {
        const user = await newUser.save();
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error.message)
    }
}