import express from "express";
import { protectRoute } from "../Middleware/auth.middleware.js";
import { getMyFriends, getRecommendedUsers  , SendFriendRequest ,AcceptFriendRequest , GetFriendRequest , GetOutgoingFriendRequest} from "../Controllers/User.controller.js";

const router = express.Router();
router.use(protectRoute); // Apply the protectRoute middleware to all routes in this file
router.get("/",getRecommendedUsers);

router.get("/friends",getMyFriends);    
router.post("/friend-request/:id",SendFriendRequest);
router.put("/friend-request/:id/accept", AcceptFriendRequest);
router.get("/friend-requests", GetFriendRequest); // Assuming you want to accept friend requests via GET, but typically this should be a POST or PUT request
router.get("outgoing-friend-requests", GetOutgoingFriendRequest); // Adjust this route as needed
export default router