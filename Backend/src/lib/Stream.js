import {StreamChat} from "stream-chat";
import dotenv from "dotenv";    
dotenv.config();

const ApiKey = process.env.STREAM_API_KEY;
const ApiSecret = process.env.STREAM_API_SECRET;

if(!ApiKey || !ApiSecret){
    console.error("Invalid Key or Secret")
}

const StreamClient = StreamChat.getInstance(ApiKey, ApiSecret);

export const upsertStreamUser = async (userData) =>{
    try{
       await StreamClient.upsertUsers([userData]);
        return userData;
       
    }catch(error){
        console.error("Error Upserting Stream user ")
    }
}


// todo
export const generateStreamToken = (userId) => {
    try {
        //ensure the userId is a string
        const userIdstr = userId.toString();
        return StreamClient.createToken(userIdstr);
        
    } catch (error) {
        console.error("Error generating Stream token", error);
        throw new Error("Failed to generate Stream token");
        
    }
};