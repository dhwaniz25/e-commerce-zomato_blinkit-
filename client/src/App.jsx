import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import fetchUserDetails from "./utils/FetchUserDetails";
import { setUserDetails } from "./store/userSlice";
import {
  setAllCategory,
  setAllSubCategory,
  setLoadingCategory,
} from "./store/productSlice";
import { useDispatch } from "react-redux";
import Axios from "./utils/Axios";
import SummaryApi from "./common/SummaryApi";
import AxiosToastError from "./utils/AxiosToastError";
import { handleAddItemCart } from "./store/cartProduct";
import GlobalProvider from "./provider/GlobalProvider";
import CartMobileLink from "./components/CartMobile";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  const fetchUser = async () => {
    const userData = await fetchUserDetails();
    console.log("user data", userData.data);
    dispatch(setUserDetails(userData.data));
  };

  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true));
      const response = await Axios({
        ...SummaryApi.getCategory,
      });
      const { data: responseData } = response;
      console.log("Response from fetch Category ", response);
      if (responseData.success) {
        console.log("Response Data from App.js", responseData.data);
        dispatch(setAllCategory(responseData.data));
        // setCategoryData(responseData.data);
      }
      console.log(responseData);
    } catch (error) {
    } finally {
      dispatch(setLoadingCategory(false));
    }
  };

  const fetchSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getSubCategory,
      });
      const { data: responseData } = response;
      console.log("Response from fetch Sub Category ", response);
      if (responseData.success) {
        console.log("Response Data from App.js", responseData.data);
        dispatch(setAllSubCategory(responseData.data));
        // setAllSubCategoryData(responseData.data);
      }
      console.log(responseData);
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    fetchUser();
    fetchCategory();
    fetchSubCategory();
  }, []);

  return (
    <GlobalProvider>
      <Header />
      <main className="min-h-[78vh]">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      {location.pathname !== "/checkout" && <CartMobileLink />}
    </GlobalProvider>
  );
}

export default App;
