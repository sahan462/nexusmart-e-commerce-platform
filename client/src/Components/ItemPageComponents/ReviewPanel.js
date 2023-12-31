import Reviewcard from "./ReviewCard";
import ReviewDashboard from "./ReviewDashboard";
import ReviewNoAvailable from "./ReviewNoAvailable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function ReviewPanel(params) {
  const [selectedStars, setSelectedStars] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);
  const [starCount, setStarCount] = useState(0);
  const [userReview, setUserReview] = useState("");

  function starHandler(index) {
    setStarCount(index + 1);
    let updatedStars = [];
    if (selectedStars[index] && selectedStars[index + 1] === false) {
      updatedStars = [false, false, false, false, false];
    } else if (selectedStars[index] && index === 4) {
      updatedStars = [false, false, false, false, false];
    } else {
      for (let i = 0; i <= index; i++) {
        updatedStars.push(true);
      }
      for (let i = index + 1; i < 5; i++) {
        updatedStars.push(false);
      }
    }

    setSelectedStars(updatedStars);
  }

  return (
    <div>
      <span className="font-medium mb-2 text-lg">Reviews</span>
      <div className=" py-4 my-2 bg-white  border border-none rounded-lg">
        <div className=" text-black font-medium pb-2">Add Your Review</div>
        <div className="py-2">
          {Array.from({ length: 5 }, (_, index) => (
            <button key={index} onClick={() => starHandler(index)}>
              <FontAwesomeIcon
                className={`h-5 w-5 ${
                  selectedStars[index] ? "text-primary" : "text-a6a9ad"
                }`}
                icon={faStar}
              />
            </button>
          ))}
        </div>
        <div className="py-2">
          <form className="">
            <textarea
              className="w-full border border-gray-500 rounded-lg h-20 px-2 py-2"
              placeholder="Type your review here"
              value={userReview}
              onChange={(ev) => {
                setUserReview(ev.target.value);
              }}
            />
          </form>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-addToCart px-4 py-2 text-white border border-none rounded-lg hover:bg-addToCartHover"
            onClick={() => {
              params.submitReviewHandler(starCount, userReview);
            }}
          >
            Submit Review
          </button>
        </div>
      </div>
      <hr />
      <div className=" pt-4 my-2 bg-white  border border-none rounded-lg ">
        <div className=" text-black font-medium pb-2">Customer Reviews</div>
        <ReviewDashboard reviewData={params.reviewData} />
        {params.reviewData.available ? (
          params.reviewData.userRatings.map((rating) => (
            <Reviewcard
              starRating={rating.starRating}
              date={rating.date.split("T")[0]}
              userName={rating.userId.name}
              comment={rating.comment}
              isDelete={true}
              reviewDeleteHandler={params.reviewDeleteHandler}
              reviewID={rating._id}
            />
          ))
        ) : (
          <ReviewNoAvailable />
        )}
      </div>
    </div>
  );
}
