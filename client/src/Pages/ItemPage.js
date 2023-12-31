import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faL, faStar } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { UserContext } from "../AuthContext";
import Loading from "../Components/Loading";
import { Navigate } from "react-router-dom";
import ImagePanel from "../Components/ItemPageComponents/ImagePanel";
import DeliveryPanel from "../Components/ItemPageComponents/DeliveryPanel";
import SellerPanel from "../Components/ItemPageComponents/SellerPanel";
import ItemDescriptionPanel from "../Components/ItemPageComponents/ItemDescriptionPanel";
import ReviewPanel from "../Components/ItemPageComponents/ReviewPanel";
import QuantityPanel from "../Components/ItemPageComponents/QuantityPanel";
import ColorPanel from "../Components/ItemPageComponents/ColorPanel";
import PricePanel from "../Components/ItemPageComponents/PricePanel";
import ItemNamePanel from "../Components/ItemPageComponents/ItemNamePanel";

export default function ItemPage() {
  const { userData, setUserData } = useContext(UserContext);
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedColorID, setselectedColorID] = useState();
  const [selectedColorName, setselectedColorName] = useState();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedImageURL, setselectedImageURL] = useState("");
  const [reviewData, setReviewData] = useState([]);
  const [invalidToken, setInvalidToken] = useState(false);
  const [newSubmit, setNewSubmit] = useState();
  const [redirect, setRedirect] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchInput = searchParams.get("id");

  useEffect(() => {
    async function fetchData() {
      try {
        const uri = "/items?id=" + searchInput;
        const response = await axios.get(uri);
        setApiData(response.data);
      } catch (error) {
        console.log("API call failed:", error);
      }
    }

    if (searchInput) {
      setLoading(true);
      fetchData();
    }
  }, [searchInput]);

  useEffect(() => {
    async function fetchReviewData() {
      if (apiData && apiData._id) {
        try {
          const uri = "feedback/" + apiData._id;
          const response = await axios.get(uri);
          setReviewData(response.data);
          setLoading(false);
        } catch (error) {
          console.log("API call failed:", error);
          setLoading(false);
        }
      }
    }

    if (apiData) {
      fetchReviewData();
    }
  }, [apiData, newSubmit]);

  if (loading) {
    return <Loading />;
  }

  // console.log(apiData);
  // console.log(reviewData);
  // console.log(userData);

  // Add to cart Handler
  async function addTocartHandler() {
    setLoading(true);
    if (userData == null) {
      setLoading(false);
      setInvalidToken(true);
    } else {
      const token = userData.token;
      const headers = {
        "x-auth-token": token,
      };
      try {
        const uri = "/cart";
        await axios.post(
          uri,
          {
            itemId: apiData._id,
            quantity: selectedQuantity,
          },
          { headers }
        );
        setLoading(false);
      } catch (error) {
        console.log("API call failed:", error);
        setLoading(false);
        setInvalidToken(true);
      }
    }
  }

  // Can't add to cart unless you logged in
  if (invalidToken) {
    console.log("token invalid ");
    const clearStorage = async () => {
      await localStorage.removeItem("userDataStorage");
    };
    clearStorage();
    setUserData("");
    return <Navigate to={"/login"} />;
  }

  // Buy now handler
  async function buyNowHandler() {
    console.log("cliked");
    setLoading(true);
    if (userData == null) {
      setLoading(false);
      setInvalidToken(true);
    } else {
      const token = userData.token;
      const headers = {
        "x-auth-token": token,
      };
      try {
        const uri = "/cart";
        await axios.post(
          uri,
          {
            itemId: apiData._id,
            quantity: selectedQuantity,
          },
          { headers }
        );
        setLoading(false);
        setRedirect(true);
      } catch (error) {
        console.log("API call failed:", error);
        setLoading(false);
        setInvalidToken(true);
      }
    }
  }
  if (redirect) {
    return <Navigate to={"/cart"}></Navigate>;
  }
  // No of review stars handling
  const noOfStars = apiData.noOfStars;
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

  // color handeling
  function colorHandler(colorID, colorName) {
    setselectedColorID(colorID);
    setselectedColorName(colorName);
  }
  const availableColors = apiData.availableColors;
  if (availableColors.length == 1) {
    setselectedColorID(availableColors[0]._id);
    setselectedColorName(availableColors[0].name);
  }

  // Image Handling
  function imageHandler(url) {
    console.log(url);
    setselectedImageURL(url);
  }
  if (selectedImageURL === "") {
    setselectedImageURL(apiData.images[0].url);
    console.log(selectedImageURL);
  }

  // submit review handler
  async function submitReviewHandler(starCount, userReview) {
    setLoading(true);
    const uri = "/feedback/newfeedback/" + apiData._id;
    const token = userData.token;
    const headers = {
      "x-auth-token": token,
    };
    try {
      const response = await axios.post(
        uri,
        {
          starRating: starCount,
          comment: userReview,
        },
        {
          headers,
        }
      );
      // console.log("response data", response.data);
      setNewSubmit(Date.now());
    } catch (err) {
      console.error("API Call Failed", err);
      setNewSubmit(Date.now()); // this should be fixed
    }
  }
  // review delete handler
  async function reviewDeleteHandler(feedBackID) {
    setLoading(true);
    const uri = `/feedback/delete/?itemId=${apiData._id}&feedbackId=${feedBackID}`;
    console.log(uri);
    const token = userData.token;
    const headers = {
      "x-auth-token": token,
    };
    try {
      const response = await axios.delete(uri, {
        headers,
      });
      console.log("response data", response.data);
      setNewSubmit(Date.now());
    } catch (err) {
      console.error("API Call Failed", err);
      setNewSubmit(Date.now()); // this should be fixed
    }
  }

  // console.log("rendered", reviewData);
  return (
    <div className=" py-4 h-full">
      {/* Images, prices, seller informations here  */}
      <div className=" grid grid-cols-12 h-[calc(100vh-7rem)] gap-3">
        {/* Images here  */}
        <div className="col-span-4 h-full">
          <ImagePanel
            imgData={apiData.images}
            imageHandler={imageHandler}
            selectedImageURL={selectedImageURL}
          />
        </div>
        {/* Item price and relevent details here  */}
        <div className="col-span-4 h-full  px-2">
          {/* Item name category reviews here  */}
          <div className="bg-white mb-6 row-span-1 grid grid-rows-5 p-2 border border-none rounded-lg shadow-2xl">
            <ItemNamePanel
              itemName={apiData.title}
              categories={apiData.categories}
              starComponents={starComponents}
              brand={apiData.brand ? apiData.brand : "Unbranded"}
              reviewCount={
                reviewData.newestFeedbackStatistics
                  ? reviewData.newestFeedbackStatistics.totalRatings
                  : "0"
              }
            />
          </div>
          {/* Item price, discount, colors, quantity here  */}
          <div className="bg-white mb-6 row-span-4 p-2 border border-none rounded-lg shadow-2xl">
            {/* Price here  */}
            <PricePanel price={apiData.price} discountData={apiData.discount} />
            {/* Color Panel Here  */}
            <div className="my-4">
              <ColorPanel
                colorData={apiData.availableColors}
                selectedColorID={selectedColorID}
                setselectedColorID={setselectedColorID}
                selectedColorName={selectedColorName}
                setselectedColorName={setselectedColorName}
                colorHandler={colorHandler}
              />
            </div>
            {/* Quantity Here */}
            <div className="my-2 flex items-center">
              <QuantityPanel
                selectedQuantity={selectedQuantity}
                setSelectedQuantity={setSelectedQuantity}
              />
            </div>
          </div>
          {/* Buy add to cart Here  */}
          <div className="bg-white mb-6  row-span-1 p-2 border border-none rounded-lg shadow-2xl grid grid-cols-6 gap-3">
            <button
              onClick={buyNowHandler}
              to="/cart"
              className="bg-primary hover:bg-primary_hover font-semibold text-white col-span-3 h-12 border border-none rounded-lg"
            >
              <div className="flex justify-center items-center h-full">
                Buy Now
              </div>
            </button>
            <button
              className="bg-addToCart hover:bg-addToCartHover font-semibold text-white col-span-3 h-12 border border-none rounded-lg"
              onClick={addTocartHandler}
            >
              Add to Cart
            </button>
          </div>
        </div>
        {/* Shipping methods and seller informations here  */}
        <div className="col-span-4 h-full px-2 ">
          {/* Delivery Details Here  */}
          <DeliveryPanel deliveryData={apiData.delivery} />
          {/* Seller Details Here  */}
          <div className="bg-white mb-6 p-2 border border-none rounded-lg shadow-2xl text-gray-500">
            <SellerPanel
              sellerData={apiData.seller}
              returnData={apiData.returnItem}
              warrantyData={apiData.warranty}
            />
          </div>
        </div>
      </div>
      {/* Item description here  */}
      <div className="bg-white shadow-2xl py-6 px-6 border border-none rounded-lg">
        <ItemDescriptionPanel descriptionData={apiData.description} />
      </div>
      {/* Item reviews here  */}
      <div className="bg-white shadow-2xl py-6 px-4 border border-none rounded-lg mt-4">
        <ReviewPanel
          submitReviewHandler={submitReviewHandler}
          reviewData={reviewData}
          userData={userData}
          reviewDeleteHandler={reviewDeleteHandler}
        />
      </div>
    </div>
  );
}
