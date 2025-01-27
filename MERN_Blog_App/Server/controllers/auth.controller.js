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
        const token = jwt.sign({id:validUser._id, isAdmin:validUser.isAdmin},process.env.JWT_TOKEN);
        const { password: pass, ...rest} = validUser._doc
        res.status(200).cookie('access_token', token, {httpOnly:true}).json(rest)
    } catch (error) {
        next(error)
    }
}

export const google = async (req, res, next)=> {
    const { name, email, googlePhotoURL } = req.body
    try {
        const user = await User.findOne({email})
        if(user) {
            const token = jwt.sign({id:user._id, isAdmin:user.isAdmin}, process.env.JWT_TOKEN)
            const {password, ...rest} = user._doc
            res.status(200).cookie('access_token', token, {
                httpOnly: true
            }).json(rest)
        }
        else {
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            const salt = bcyrptjs.genSaltSync(10);
            const hashedPassword = bcyrptjs.hashSync(generatePassword, salt)
            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoURL 
            })
            await newUser.save()
            const token = jwt.sign({id:user._id,isAdmin:newUser.isAdmin}, process.env.JWT_TOKEN)
            const {password, ...rest} = newUser._doc
            res.status(200).cookie('access_token', token, {
                httpOnly: true
            }).json(rest)
        }
        
    } catch (error) {
        next(error)
    }
}