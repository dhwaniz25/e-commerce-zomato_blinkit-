import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { displayPriceInRupees } from "../utils/DisplayPriceInRupees";
import Divider from "../components/Divider";
import image1 from "../assets/minute_delivery.png";
import image2 from "../assets/Best_Prices_Offers.png";
import image3 from "../assets/Wide_Assortment.png";
import { priceWithDiscount } from "../utils/PriceWithDiscount";
import AddToCartButton from "../components/AddToCartButton";

const ProductDisplayPage = () => {
  const params = useParams();
  console.log("Params from product display page", params);
  let productId = params?.product?.split("-")?.slice(-1)[0];
  console.log("Product Id from product display page", productId);

  const [data, setData] = useState({
    name: "",
    image: [],
  });
  const [image, setImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const imageContainer = useRef();

  // const fetchProductDetails = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await Axios({
  //       ...SummaryApi.getProductDetails,
  //       data: {
  //         productId: productId,
  //       },
  //     });

  //     const { data: responseData } = response;

  //     if (response.success) {
  //       setData(responseData.data);
  //     }
  //   } catch (error) {
  //     AxiosToastError(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: { productId },
      });

      console.log("Full Axios response:", response);

      const responseData = response.data;
      console.log("Response Data:", responseData);

      if (responseData.success) {
        setData(responseData.data);
        // setImage(responseData.data.image[0]);
        console.log("✅ Final Product Data:", responseData.data);
      } else {
        console.log("❌ API returned success=false");
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [params]); //when params get changed then again this fetchProductDetails api gets call

  console.log("Data from product display page", data);

  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100;
  };

  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100;
  };

  return (
    <section className="container mx-auto p-4 grid lg:grid-cols-2 ">
      {/* Image Part */}
      <div className="">
        <div className="bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded min-h-56 max-h-56 h-full w-full">
          <img
            src={data.image[image]}
            alt=""
            className="w-full h-full object-scale-down"
          />
        </div>
        <div className="flex items-center justify-center gap-3 my-2">
          {data.image.map((img, index) => {
            return (
              <div
                key={img + index + "point"}
                className={`bg-slate-200 w-3 h-3 lg:w-5 lg:h-5 rounded-full ${
                  index === image && "bg-slate-300"
                }`}
              ></div>
            );
          })}
        </div>
        <div className="grid relative">
          <div
            ref={imageContainer}
            className="flex gap-4 relative z-10 w-full overflow-x-auto scrollbar-none"
          >
            {data.image.map((img, index) => {
              return (
                <div
                  className="h-20 w-20 shadow-md min-h-20 min-w-20 cursor-pointer"
                  key={img + index}
                >
                  <img
                    src={img}
                    alt="mini-product"
                    className="w-full h-full object-scale-down"
                    onClick={() => setImage(index)}
                  />
                </div>
              );
            })}
          </div>
          <div className="w-full h-full -ml-3 flex justify-between absolute items-center">
            <button
              onClick={handleScrollRight}
              className="z-10 bg-white relative p-1 rounded-full shadow-lg"
            >
              <FaAngleLeft />
            </button>
            <button
              onClick={handleScrollLeft}
              className="z-10 bg-white relative p-1 rounded-full shadow-lg"
            >
              <FaAngleRight />
            </button>
          </div>
        </div>
        <div className="my-4 hidden lg:grid gap-3">
          <div>
            <p className="font-semibold">Description:</p>
            <p className="text-base">{data.description}</p>
          </div>
          <div>
            <p className="font-semibold">Unit:</p>
            <p className="text-base">{data.unit}</p>
          </div>
          {data?.more_details &&
            Object.keys(data?.more_details).map((element, index) => {
              return (
                <div>
                  <p className="font-semibold">{element}</p>
                  <p className="text-base">{data.more_details[element]}</p>
                </div>
              );
            })}
        </div>
      </div>
      {/* Other Part for Details */}
      <div className="p-4 lg:pl-7 text-base lg:text-lg">
        <h2 className="text-lg font-semibold lg:text-3xl">{data.name}</h2>
        <p className="bg-green-300 w-fit px-2 rounded-full">10 Min</p>
        <p className="">{data.unit}</p>
        <Divider />
        <div>
          <p className="">Price: </p>
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="border border-green-600 px-4 py-2 rounded bg-green-50 w-fit">
              <p className="font-semibold text-lg lg:text-xl">
                {displayPriceInRupees(
                  priceWithDiscount(data.price, data.discount)
                )}
              </p>
            </div>
            {data.discount && (
              <p className="line-through">{displayPriceInRupees(data.price)}</p>
            )}
            {data.discount && (
              <p className="font-bold text-green-600 lg:text-2xl">
                {data.discount}%
                <span className="text-base text-neutral-500">Discount</span>
              </p>
            )}
          </div>
        </div>

        {data.stock === 0 ? (
          <p className="text-lg text-red-500 my-2">
            Sorry, we are out of stock for this product !
          </p>
        ) : (
          // <button className="my-4 px-4 py-1 bg-green-600 hover:bg-green-700 text-white rounded font-semibold">
          //   Add
          // </button>
          <div className="my-4">
            <AddToCartButton data={data} />
          </div>
        )}

        <h2 className="font-semibold">Why Shop From Us?</h2>
        <div>
          <div className="flex items-center gap-4 my-4">
            <img src={image1} alt="express delivery" className="w-20 h-20" />
            <div className="text-sm">
              <div className="font-semibold">Express Delivery</div>
              <p>Get your orders delivered at your doorsteps in minutes!</p>
            </div>
          </div>
          <div className="flex items-center gap-4 my-4">
            <img src={image2} alt="best price offers" className="w-20 h-20" />
            <div className="text-sm">
              <div className="font-semibold">Best Prices For Sure 💯</div>
              <p>
                Best price offers, products bought directly from manufacture!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 my-4">
            <img src={image3} alt="wide assortment" className="w-20 h-20" />
            <div className="text-sm">
              <div className="font-semibold">Wide Assortment</div>
              <p>
                Choose from wide range of products from over food, personal,
                pharma, home decor and many more!
              </p>
            </div>
          </div>
        </div>
        <div className="my-4 lg:hidden grid gap-3">
          <div>
            <p className="font-semibold">Description:</p>
            <p className="text-base">{data.description}</p>
          </div>
          <div>
            <p className="font-semibold">Unit:</p>
            <p className="text-base">{data.unit}</p>
          </div>
          {data?.more_details &&
            Object.keys(data?.more_details).map((element, index) => {
              return (
                <div>
                  <p className="font-semibold">{element}</p>
                  <p className="text-base">{data.more_details[element]}</p>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default ProductDisplayPage;
