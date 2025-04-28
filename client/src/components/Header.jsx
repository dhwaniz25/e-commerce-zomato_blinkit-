import React, { use, useEffect, useState } from "react";
import logo from "../assets/logo.png";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import useMobile from "../hooks/useMobile";
import { TiShoppingCart } from "react-icons/ti";
import { useSelector } from "react-redux";
import { GoTriangleDown } from "react-icons/go";
import { GoTriangleUp } from "react-icons/go";
import UserMenu from "./UserMenu";
import { displayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import DisplayCartItem from "./DisplayCartItem";

const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const isSearchPage = location.pathname === "/search";
  const user = useSelector((state) => state?.user);
  console.log("User from store", user);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const cartItem = useSelector((state) => state.cartItem.cart);
  console.log("Cart Item from header", cartItem);
  // const [totalPrice, setTotalPrice] = useState(0);
  // const [totalQty, setTotalQty] = useState(0);
  const { totalPrice, totalQty } = useGlobalContext();
  const [openCartSection, setOpenCartSection] = useState(false);

  const redirectToLoginPage = () => {
    navigate("/login");
  };

  const handleCloseUserMenu = () => {
    setOpenUserMenu(false);
  };

  const handleMobileUser = () => {
    if (!user._id) {
      navigate("/login");
      return;
    }
    navigate("/user");
  };

  //total item & total price
  // useEffect(() => {
  //   const qty = cartItem.reduce((preve, curr) => {
  //     return preve + curr.quantity;
  //   }, 0);
  //   setTotalQty(qty);
  //   const tprice = cartItem.reduce((preve, curr) => {
  //     return preve + curr.productId.price * curr.quantity;
  //   }, 0);
  //   setTotalPrice(tprice);
  //   console.log("Total Price from header", tprice);
  // }, [cartItem]);

  return (
    <header className="h-24 lg:h-20 lg:shadow-md sticky top-0 z-40 flex flex-col justify-center gap-1 bg-white">
      {!(isSearchPage && isMobile) && (
        <div className="container mx-auto flex items-center px-3 justify-between">
          {/* Logo */}
          <div className="h-full">
            <Link to={"/"} className="h-full flex justify-center items-center">
              <img
                src={logo}
                width={170}
                height={60}
                alt="logo"
                className="hidden lg:block"
              />
              <img
                src={logo}
                width={120}
                height={60}
                alt="logo"
                className="lg:hidden"
              />
            </Link>
          </div>
          {/* Search */}
          <div className="hidden lg:block">
            <Search />
          </div>
          {/* Login & MyCart */}
          <div className="">
            {/* user icon diaplay only in mobile version */}
            <button
              className="text-neutral-600 lg:hidden"
              onClick={handleMobileUser}
            >
              <FaRegUserCircle size={26} />
            </button>
            {/* for desktop version */}
            <div className="hidden lg:flex items-center gap-10">
              {user?._id ? (
                <div className="relative ">
                  <div
                    onClick={() => setOpenUserMenu((preve) => !preve)}
                    className="flex select-none items-center gap-1 cursor-pointer"
                  >
                    <p>Account</p>
                    {openUserMenu ? (
                      <GoTriangleUp size={25} />
                    ) : (
                      <GoTriangleDown size={25} />
                    )}
                  </div>
                  {openUserMenu && (
                    <div className="absolute right-0 top-12">
                      <div className="bg-white rounded p-4 min-w-52 lg:shadow-lg">
                        <UserMenu close={handleCloseUserMenu} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={redirectToLoginPage} className="text-lg px-2">
                  Login
                </button>
              )}
              <button
                onClick={() => setOpenCartSection(true)}
                className="flex items-center gap-2 bg-green-800 hover:bg-green-700 px-3 py-2 rounded text-white"
              >
                {/* add to cart icon */}
                <div className="animate-bounce">
                  <TiShoppingCart size={26} />
                </div>
                <div className="font-semibold text-sm">
                  {cartItem[0] ? (
                    <div>
                      <p>{totalQty} Items</p>
                      <p>{displayPriceInRupees(totalPrice)}</p>
                    </div>
                  ) : (
                    <p>My Cart</p>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="container mx-auto px-2 lg:hidden">
        <Search />
      </div>
      {openCartSection && (
        <DisplayCartItem close={() => setOpenCartSection(false)} />
      )}
    </header>
  );
};

export default Header;
