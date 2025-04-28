import React, { useState } from "react";
import { displayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { Link } from "react-router-dom";
import { validUrlConvert } from "../utils/validUrlConvert";
import { priceWithDiscount } from "../utils/PriceWithDiscount";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { useGlobalContext } from "../provider/GlobalProvider";
import AddToCartButton from "../components/AddToCartButton";

const CardProduct = ({ data }) => {
  const url = `/product/${validUrlConvert(data.name)}-${data._id}`;
  const [loading, setLoading] = useState(false);
  
  return (
    // <div className="">
    <Link
      to={url}
      className="border py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded cursor-pointer bg-white"
    >
      <div className="min-h-20 w-full max-h-24 lg:max-h-32 rounded overflow-hidden">
        <img
          src={data.image[0]}
          alt=""
          className="w-full h-full object-scale-down lg:scale-125"
        />
      </div>
      <div className="rounded text-xs w-fit p-[1px] px-2 my-2 text-green-600 bg-green-50 ">
        10 min
      </div>
      <div>
        {Boolean(data.discount) && (
          <p className="text-green-500 bg-green-100 px-2 w-fit rounded text-sm">
            {data.discount}% off
          </p>
        )}
      </div>
      <div className="px-2 font-medium text-ellipsis text-sm lg:text-base line-clamp-2">
        {data.name}
      </div>
      <div className="w-fit gap-1 px-2 text-sm lg:text-base">{data.unit}</div>
      <div className="flex items-center justify-between gap-3 text-sm m-1 lg:text-base">
        <div className="flex items-center gap-1">
          <div className="font-semibold">
            {displayPriceInRupees(priceWithDiscount(data.price, data.discount))}
          </div>
        </div>
        <div>
          {data.stock === 0 ? (
            <p className="text-red-500 text-sm text-center">Out Of Stock</p>
          ) : (
           <AddToCartButton data={data}/>
          )}
        </div>
      </div>
    </Link>
    // </div>
  );
};

export default CardProduct;
