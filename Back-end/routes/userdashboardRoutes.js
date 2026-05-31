const exporess = require("express");
const router = exporess.Router();

const userDashboardController = require("../controller/Dashboards/userDashboardController");
const User = require("../model/userSchema");
const upload = require("../middleware/multer");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const PostLike = require("../model/PostLike");

router.get("/BookedTrips",authenticate, authorize("user"), userDashboardController.getBookedTrips);


router.post("/saveTrips/:tripId", authenticate, authorize("user"), userDashboardController.saveTrip);


router.get("/savedTrips", authenticate, authorize("user"), userDashboardController.getSavedTrips);


router.delete("/removeSavedTrip/:tripId", authenticate, authorize("user"), userDashboardController.removeSavedTrip);


router.patch("/AddProfilePicture",authenticate, authorize("user"),upload.single("profilePicture"), userDashboardController.updateProfilePicture);

router.get("/blogLikes", authenticate, authorize("user"),async (req, res, nxt) => {
    try {
        const userId = req.user?.id || req.user?.userId || req.body.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID not found" });
        }

        const userLikedBlogs = await PostLike.find({ userId })
            .sort({ createdAt: -1 })
            .populate({
                path: "blogId",
                model: "blog",
                select: "title content images category author createdAt",
                populate: {
                    path: "author",
                    model: "User",
                    select: "name email",
                },
            });
        const likedBlogs = (await Promise.all(userLikedBlogs
            .map(async (like) => {
                const blog = like.blogId?.toObject ? like.blogId.toObject() : like.blogId;
                if (!blog || typeof blog !== "object") return null;
                const likeCount = await PostLike.countDocuments({ blogId: blog._id });
                return {
                    ...blog,
                    likedAt: like.createdAt,
                    likeId: like._id,
                    isLiked: true,
                    likes: likeCount,
                    likesCount: likeCount,
                };
            })))
            .filter(Boolean);

        res.status(200).json({ likes: userLikedBlogs, likedBlogs });
    }catch (err) {
        nxt(err)
    }
})


module.exports = router;
