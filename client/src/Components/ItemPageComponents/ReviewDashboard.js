import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default function ReviewDashboard(params) {
  function getStars(noOfStars) {
    const starComponents = [];
    for (let i = 0; i < noOfStars; i++) {
      starComponents.push(
        <FontAwesomeIcon
          className="h-3 w-3"
          icon={faStar}
          style={{ color: "#4287f5" }}
        />
      );
    }
    for (let i = 0; i < 5 - noOfStars; i++) {
      starComponents.push(
        <FontAwesomeIcon
          className="h-3 w-3"
          icon={faStar}
          style={{ color: "#a6a9ad" }}
        />
      );
    }
    return starComponents;
  }
  function getMainStars(noOfStars) {
    const starComponents = [];
    for (let i = 0; i < noOfStars; i++) {
      starComponents.push(
        <FontAwesomeIcon
          className="h-8 w-8"
          icon={faStar}
          style={{ color: "#4287f5" }}
        />
      );
    }
    for (let i = 0; i < 5 - noOfStars; i++) {
      starComponents.push(
        <FontAwesomeIcon
          className="h-8 w-8"
          icon={faStar}
          style={{ color: "#a6a9ad" }}
        />
      );
    }
    return starComponents;
  }

  return (
    <div className="my-4 bg-white shadow-2xl py-4 px-4 border border-none rounded-lg">
      <div className="grid grid-cols-6">
        <div className="col-span-3">
          <div className="text-2xl py-2">
            <span className="text-5xl font-medium">
              {params.reviewData.available
                ? Math.floor(
                    params.reviewData.newestFeedbackStatistics.averageStarRating
                  )
                : 0}
            </span>
            /5
          </div>
          <div>
            {params.reviewData.available
              ? getMainStars(
                  Math.floor(
                    params.reviewData.newestFeedbackStatistics.averageStarRating
                  )
                )
              : getMainStars(0)}
          </div>
          <div className="text-gray-500 pb-2">
            {params.reviewData.available
              ? params.reviewData.newestFeedbackStatistics.totalRatings
              : 0}{" "}
            total reviews
          </div>
        </div>
        <div className="col-span-3 flex-row justify-center">
          <div>
            {getStars(5)}{" "}
            <span className="px-2 text-gray-400">
              {params.reviewData.available
                ? params.reviewData.newestFeedbackStatistics.fiveStarCount
                : 0}{" "}
              Ratings
            </span>
          </div>
          <div>
            {getStars(4)}{" "}
            <span className="px-2 text-gray-400">
              {params.reviewData.available
                ? params.reviewData.newestFeedbackStatistics.fourStarCount
                : 0}{" "}
              Ratings
            </span>
          </div>
          <div>
            {getStars(3)}{" "}
            <span className="px-2 text-gray-400">
              {params.reviewData.available
                ? params.reviewData.newestFeedbackStatistics.threeStarCount
                : 0}{" "}
              Ratings
            </span>
          </div>
          <div>
            {getStars(2)}{" "}
            <span className="px-2 text-gray-400">
              {params.reviewData.available
                ? params.reviewData.newestFeedbackStatistics.twoStarCount
                : 0}{" "}
              Ratings
            </span>
          </div>
          <div>
            {getStars(1)}{" "}
            <span className="px-2 text-gray-400">
              {params.reviewData.available
                ? params.reviewData.newestFeedbackStatistics.oneStarCount
                : 0}{" "}
              Ratings
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
