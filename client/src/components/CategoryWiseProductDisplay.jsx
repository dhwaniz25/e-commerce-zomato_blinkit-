import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import SummaryApi from "../common/SummaryApi";
import CardLoading from "./CardLoading";
import CardProduct from "./CardProduct";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { validUrlConvert } from "../utils/validUrlConvert";

const CategoryWiseProductDisplay = ({ id, name }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef();

  const loadingCardNumber = new Array(6).fill(null);

  const subCategoryData = useSelector((state) => state.product.allSubCategory);
  const navigate = useNavigate();

  const fetchCategoryWiseProduct = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: {
          id: id,
        },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        setData(responseData.data);
      }
      console.log(
        "response Data from Fetch Category Wise Product",
        responseData
      );
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCategoryWiseProduct();
  }, []);

  const handleScrollRight = () => {
    containerRef.current.scrollLeft += 200;
  };

  const handleScrollLeft = () => {
    containerRef.current.scrollLeft -= 200;
  };

  //   const handleRedirectProductListPage = async () => {
  //     console.log("Id & Name from Home Page", id, name);
  //     const subCategory = subCategoryData.find((sub) => {
  //       const filterData = sub.category.some((c) => {
  //         console.log(sub);
  //         return c._id == id;
  //       });
  //       return filterData ? true : null;
  //     });
  //     // const url = "/" + cat + "-" + id;
  //     const url = `/${validUrlConvert(name)}-${id}/${validUrlConvert(
  //       subCategory.name
  //     )}-${subCategory._id}`;
  //     return url
  //     // navigate(url);
  //     // console.log("SubCategory", subCategory);
  //     // console.log("URL from Home Page", url);
  //   };
  // const redirectUrl = handleRedirectProductListPage()

  const handleRedirectProductListPage = () => {
    // console.log("Id & Name from Home Page", id, name);
    const subCategory = subCategoryData.find((sub) => {
      return sub.category?.some((c) => c._id == id);
    });

    if (!subCategory) {
      console.warn("No matching subCategory found for id:", id);
      return "#";
    }

    const url = `/${validUrlConvert(name)}-${id}/${validUrlConvert(
      subCategory.name
    )}-${subCategory?._id}`;
    return url;
  };

  return (
    <div>
      <div className="container mx-auto p-4 flex items-center justify-between gap-4">
        <h3 className="font-semibold text-lg md:text-xl">{name}</h3>
        <Link
          to={handleRedirectProductListPage()}
          className="text-green-600 hover:text-green-400 cursor-pointer font-semibold"
        >
          See All
        </Link>
      </div>
      <div className="relative flex items-center">
        <div
          className="flex gap-4 md:gap-6 lg:gap-8 container mx-auto px-4 overflow-x-scroll scrollbar-none scroll-smooth"
          ref={containerRef}
        >
          {loading &&
            loadingCardNumber.map((_, index) => {
              // '_' because we are not using any variable and this place is for variable
              return (
                <CardLoading
                  key={"CardLoadingCategoryWiseProductDisplay" + index}
                />
              );
            })}

          {data.map((p, index) => {
            return (
              <CardProduct
                data={p}
                key={p._id + "CategoryWiseProductDisplay" + index}
              />
            );
          })}
        </div>
        <div className="w-full left-0 right-0 container mx-auto absolute hidden lg:flex justify-between max-w-full px-2">
          <button
            className="z-10 relative bg-white hover:bg-gray-100 shadow-xl p-2 rounded-full text-lg"
            onClick={handleScrollLeft}
          >
            <FaAngleLeft />
          </button>
          <button
            className="z-10 relative bg-white hover:bg-gray-100 shadow-xl p-2 rounded-full text-lg"
            onClick={handleScrollRight}
          >
            <FaAngleRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryWiseProductDisplay;
