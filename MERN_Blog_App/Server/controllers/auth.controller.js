import User from "../models/user.model.js"
import bcyrptjs from 'bcryptjs'
import {errorHandler} from '../utils/error.js'
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next)=> {
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
        next(error)
    }
}

export const signin = async(req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({email})
        if(!validUser) {
            return next(errorHandler(404,'Invalid Credentials!'))
        }
        const validPassword = bcyrptjs.compareSync(password, validUser.password);
        if(!validPassword) {
            return next(errorHandler(400,'Invalid Credentials!'))
        }
        const token = jwt.sign({id:validUser._id},process.env.JWT_TOKEN);
        const { password: pass, ...rest} = validUser._doc
        res.status(200).cookie('access_token', token, {httpOnly:true}).json(rest)
    } catch (error) {
        next(error)
    }
}