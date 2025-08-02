import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const UserScehma = new  mongoose.Schema({
    fullName:{
         type : String ,
         required : [true , "Name is required "]
    },
    email : {
        type : String ,
        required : [true , "Email is Required"],
        unique : true 
    },
    password : {
        type : String ,
        required : true ,
        minlength : 6 
    },
    bio : {
          type : String ,
          default : ""
    },
    profilePic : {
        type : String,
        default : ""
    },
    nativeLanguage : {
          type : String ,
          default : "",
    },
    learningLanguage : {
        type : String ,
          default : "",
    },
    location : {
        type : String ,
          default : "",
    },
    // Indicates whether the user has completed the onboarding processe
    isOnboarded : {
        type : Boolean,
          default : false,
    }, 
    // Array of ObjectIds referencing User model for friends 
   // This allows for a self-referential relationship 

    friends : [
     {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
     }
    ]
},{timestamps:true})

UserScehma.pre("save", async function(next) {{
    if(!this.isModified("password")) {
      return next(); // If password is not modified, skip hashing
    }
    try{
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password,salt);
      next(); 
    }catch(error){
        next(error); // Pass the error to the next middleware
    }
}})


UserScehma.methods.matchPassword = async function(password) {
    return   await bcrypt.compare(password, this.password);
}
const User = mongoose.model("User", UserScehma);
export default User;

