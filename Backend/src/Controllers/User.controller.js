import FriendRequest from "../Models/FriendRequest.js";

export async function getRecommendedUsers(req, res) {
    try { 
        const currentUserId = req.user.id;  
        const currentUser = req.user;
        const recommendedUsers = await User.find({
           $and: [
                { _id: { $ne: currentUserId } }, // Exclude current user    
                {$id : { $nin: currentUser.friends } } ,// Exclude friends
                {isOnboarded: true} // Only include onboarded users
           ]
        })
        res.status(200).json({ recommendedUsers });
    } catch (error) {
        console.log("Error fetching recommended users", error);
        res.status(500).json({ message: "Internal server error" });
    }
    
}

export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user._id)
        .select("friends") // Exclude password and __v field
        .populate("friends", "fullName  profilePic nativeLanguage learningLanguage"); // Populate friends with name, email, and profilePicture

        res.status(200).json({ friends: user.friends });
        
    } catch (error) {
        console.log("Error fetching friends", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function SendFriendRequest(req, res) {
    try {
        const myId = req.user._id; 
        const { id : friendId } = req.params; // Extract friendId from request parameters
        if (myId  === friendId) {
            return res.status(400).json({ message: "You cannot send a friend request to yourself" });
        }

        const recipient = await User.findById(friendId);
        if (!recipient) {
            return res.status(404).json({ message: "Recipinat not found" });
        }
         
       if(recipient.friends.includes(myId)) {
            return res.status(400).json({ message: "You are already friends with this user" });
        }

        // check if a friend request already exists
        const existingRequest = await FriendRequest.findOne({
            $or:[
                { sender: myId, recipient: friendId },
                { sender: friendId, recipient: myId }
            ],
        })

        if (existingRequest) {
            return res.status(400).json({ message: "Friend request already exists" });
        }

        const newFriendRequest = new FriendRequest({
            sender: myId,
            recipient: friendId,
        });

        res.status(201).json(newFriendRequest);

    
    } catch (error) {
        console.log("Error sending friend request", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function AcceptFriendRequest(req, res) {
    try {
        const {id:FriendRequestId} = req.params; // Extract FriendRequestId from request parameters

        const friendRequest = await FriendRequest.findById(FriendRequestId);
        if (!friendRequest) { 
            return res.status(404).json({ message: "Friend request not found" });
        }

        // verify that the recipient is the current user
        if (friendRequest.recipient.toString !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to accept this friend request" });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient } 
        });

        await Fr.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender } 
        });
        
        res.status(200).json({ message: "Friend request accepted successfully" });
    } catch (error) {
        console.log("Error accepting friend request", error);
        res.status(500).json({ message: "Internal server error" });
        
    }

}

export async function GetFriendRequest(req, res) {
    try {
        const friendRequests = await FriendRequest.find({
            recipient: req.user._id,
            status: "pending"
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

        const AcceptFriendRequest  = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted",
        }).populate("recipient", "fullName profilePic   ");

        res.status(200).json({ friendRequests , AcceptFriendRequest }); 


    } catch (error) {
        console.log("Error fetching friend requests", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function GetOutgoingFriendRequest(req, res) {
    try {
        const outgoingRequests = await FriendRequest.find({
            sender: req.user.id,
            status: "pending"
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");


    res.send(200).json({ outgoingRequests });
    } catch (error) {
        console.log("Error fetching outgoing friend requests", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}