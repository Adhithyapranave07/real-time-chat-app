import { upsertStreamUser } from "../lib/Stream.js";
import User  from "../Models/User.js"; 
import jwt from "jsonwebtoken";
export async function signup(req,res){
    const { fullName, email, password } = req.body;
    try {
        if( !fullName || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        if(password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
        }
       
         const exsistingUser = await User.findOne({email});
         if(exsistingUser){
            return res.status(400).json({ message: "User already exists" });
         }

         const idx = Math.floor(Math.random() * 100 ) + 1; // Genaratinga a num between 1 to 100
         const avatar = `https://avatar.iran.liara.run/public/${idx}.png`; // Using a random avatar from the API;

         const user = await User.create({
            fullName,
            email,
            password,
            profilePic: avatar
         });

        try{
        await upsertStreamUser({
            id:user._id.toString(),
            name : user.fullName,
            image : user.profilePic || ""
        
         });
         console.log( `Stream user Created for ${user.fullName}`)

        } catch(error){
           console.log("Error Creating Stream user ");
        }
          const token = jwt.sign({userId : user._id}, process.env.JWT_SECRET, {
            expiresIn: "7d"
          })

          res.cookie("jwt",token,{
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days  
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            sameSite : "strict", // Helps prevent CSRF attacks
            secure :   process.env.NODE_ENV === "production" // Ensures the cookie is sent over HTTPS in production
             
          })

          res.status(201).json({succes : true, User : user });
    }  
    catch(error){
        console.log("Error in signup controller", error); 
        res.status(500).json({ message: "Internal server error" });
    }
}
export async  function login(req,res){
     try{
        const {email, password} = req.body;
        if(!email || !password) {     res.status(400).send("Please fill all the fields"); }
        const user = await User.findOne({email});
        if(!user) {
            return res.status(401).json({ message: "Invalid Email or password " });
        } 
        const isMatch = await user.matchPassword(password);
        if(!isMatch) {
            return res.status(401).json({ message: "Invalid Email or  PassWord " });
        }
            const token = jwt.sign({userId : user._id}, process.env.JWT_SECRET, {
            expiresIn: "7d"
          })

          res.cookie("jwt",token,{
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days  
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            sameSite : "strict", // Helps prevent CSRF attacks
            secure :   process.env.NODE_ENV === "production" // Ensures the cookie is sent over HTTPS in production
             
          })

          res.status(201).json({succes : true, User : user });

    }catch(error){
        console.log("Error in login controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export async  function logout(req,res){
    res.clearCookie("jwt")
    res.status(200).json({ message: "Logged out successfully" });
}

export async function onboard(req,res) {
    try {
        const {fullName,bio, nativeLanguage, learningLanguage, location} = req.body;
        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({ message: "Please fill all the fields" ,
                missingFields: {
                    fullName: !fullName,
                    bio: !bio,
                    nativeLanguage: !nativeLanguage, 
                    learningLanguage: !learningLanguage,
                    location: !location
                }.filter(Boolean) // Filter out missing fields
            });
        }

     const updatedUser =    await User.findByIdAndUpdate(req.user._id, {
           ...req.body,
           isOnboarded: true,
        }, { new: true });
        if(!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic || ""
            });
        } catch (error) {
            console.error("Error updating Stream user during onboarding:", error);
            return res.status(500).json({ message: "Internal server error" });
            
        }
        res.status(200).json({ message: "Onboarding completed successfully", user: updatedUser });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.error("Error in onboarding controller:", error);
    }
}