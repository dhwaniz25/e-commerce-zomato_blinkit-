import React from "react";
import { useGlobalContext } from "../provider/GlobalProvider";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { displayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { FaCaretRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const CartMobileLink = () => {
  const { totalPrice, totalQty } = useGlobalContext();
  const cartItem = useSelector((state) => state.cartItem.cart);

  return (
    <>
      {cartItem[0] && (
        <div className="sticky bottom-4 p-2">
          <div className="bg-green-500 px-2 py-1 rounded text-white text-sm flex items-center justify-between gap-3 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-600 rounded w-fit">
                <MdOutlineShoppingCartCheckout />
              </div>
              <div className="text-xs">
                <p>{totalQty} items</p>
                <p>{displayPriceInRupees(totalPrice)} </p>
              </div>
            </div>
            <Link to={"/cart"} className="flex items-center gap-2">
              <span className="text-sm">View Cart</span>
              <FaCaretRight />
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default CartMobileLink;
