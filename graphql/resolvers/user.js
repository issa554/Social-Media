
const bcrypt =require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../../models/User')
const { UserInputError } = require("apollo-server")
require('dotenv').config()
const {
    validateRegisterInput,
   validateLoginInput
  } = require('../../util/validators');
  const GenrateJWT = (user)=>{
      return jwt.sign({
        id:user.id,
        email:user.email,
        username:user.username
    }, process.env.SECRET_KEY ,{expiresIn:"1h"});
  }
module.exports={
    Mutation:{
        async login(_ ,{username , password}){
            const { valid, errors } = validateLoginInput(
                username,
                
                password,
                
              );
              if(!valid){
                throw new UserInputError('Wrong crendetials', { errors });

              }
      const user = await User.findOne({username})
      if(!user){
        errors.general = 'Wrong crendetials';
        throw new UserInputError('Wrong crendetials', { errors });
      }

      const match = await bcrypt.compare(password , user.password)

      if(!match){
        errors.general = 'Wrong crendetials';
        throw new UserInputError('Wrong crendetials', { errors });
      }
      const token = GenrateJWT(user)
      return {
        ...user._doc,
        id:user._id,
        token
    }
        },
     async register(_,{registerInput:{username , email ,password , confirmPassword} } ,context , info){
        const { valid, errors } = validateRegisterInput(
            username,
            email,
            password,
            confirmPassword
          ); 
        if(!valid){
        throw new UserInputError('Errors', { errors });
     }
     
        const user = await User.findOne({ username })
     if(user){
         throw new UserInputError('Error', {
             errors :{
                 username:"username is alrady used"
             }
         })
     }
        password = await bcrypt.hash(password , 12 );
   
      
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString()
      });

      const res = await newUser.save();


      const token = GenrateJWT(res)

      return {
          ...res._doc,
          id:res._id,
          token
      }
        }
    }
}