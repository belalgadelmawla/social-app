import jwt from 'jsonwebtoken';

export const generateToken = ({payLoad,signature,options = {}}) => {
    return jwt.sign(payLoad,signature,options)
}

export const verifyToken = ({token,signature,options = {}}) => {
    return jwt.verify(token,signature,options);
}