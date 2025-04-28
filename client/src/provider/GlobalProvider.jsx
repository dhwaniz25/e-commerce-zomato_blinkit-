import { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart } from "../store/cartProduct";
import toast from "react-hot-toast";
import { priceWithDiscount } from "../utils/PriceWithDiscount";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";

export const GlobalContext = createContext(null);

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const cartItem = useSelector((state) => state.cartItem.cart);
  const [notDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0);
  const user = useSelector((state) => state?.user);

  const fetchCartItem = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getCartItem,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        console.log("Fetched Cart Items:", responseData.data);
        dispatch(handleAddItemCart(responseData.data));
        console.log(
          "Response data from fetch cart item in app.js",
          responseData
        );
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const updateCartItem = async (id, qty) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateCartItemQty,
        data: {
          _id: id,
          qty: qty,
        },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        // toast.success(responseData.message);
        fetchCartItem();
        return responseData;
      }
    } catch (error) {
      AxiosToastError(error);
      return error;
    }
  };

  const deleteCartItem = async (cartId) => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteCartItem,
        data: {
          _id: cartId,
        },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        fetchCartItem();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const fetchOrder = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getOrderItems,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(setOrder(responseData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    fetchCartItem();
  }, []);

  useEffect(() => {
    const qty = cartItem.reduce((preve, curr) => {
      return preve + curr.quantity;
    }, 0);
    setTotalQty(qty);

    const tprice = cartItem.reduce((preve, curr) => {
      const priceAfterDiscount = priceWithDiscount(
        curr?.productId?.price,
        curr?.productId?.discount
      );
      console.log("Price After Discount", priceAfterDiscount);
      return preve + priceAfterDiscount * curr.quantity;
    }, 0);
    setTotalPrice(tprice);

    const notDiscountPrice = cartItem.reduce((preve, curr) => {
      return preve + curr?.productId?.price * curr.quantity;
    }, 0);
    setNotDiscountTotalPrice(notDiscountPrice);
  }, [cartItem]);

  const handleLogOut = () => {
    localStorage.clear();
    dispatch(handleAddItemCart([]));
  };

  const fetchAddress = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getAddress,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(handleAddAddress(responseData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    fetchCartItem();
    handleLogOut();
    fetchAddress();
    fetchOrder();
  }, [user]);

  return (
    <GlobalContext.Provider
      value={{
        fetchCartItem,
        updateCartItem,
        deleteCartItem,
        fetchAddress,
        fetchOrder,
        totalPrice,
        totalQty,
        notDiscountTotalPrice,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
