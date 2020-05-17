const Post = require('../models/post');
const Review = require('../models/review');


module.exports = {
    // Reviews Create
    async reviewCreate(req, res, next) {
        // ⭐️⭐️⭐️
        // find the post by its id
        let post = await Post.findById(req.params.id);
        // create the review
        req.body.review.author = req.user._id
        let review = await Review.create(req.body.review);
        // assign review to post
        post.reviews.push(review);
        // save the post
        post.save();
        // ⭐️⭐️⭐️
        // redirect to the post
        req.session.success = 'Review created successfully'
        res.redirect(`/posts/${post.id}`);
    },

    // Reviews Update
    async reviewUpdate(req, res, next) {
        await Review.findByIdAndUpdate(req.params.review_id, req.body.review);
        req.session.success = 'Review updated successfully!'
        res.redirect(`/posts/${req.params.id}`);
    },
    // Reviews Destroy
    async reviewDestroy(req, res, next) {
        // find the post by its id and update by deleting the review_id from the post.reviews array. 
        let post = await Post.findByIdAndUpdate(req.params.id, {
            $pull: { reviews: req.params.review_id }
        });
        // find the actual review document and remove it from the DB
        await Review.findByIdAndRemove(req.params.review_id);
        req.session.success = 'Review deleted successfully!';
        res.redirect(`/posts/${req.params.id}`);
    }
}

/*
const ReviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});
*/