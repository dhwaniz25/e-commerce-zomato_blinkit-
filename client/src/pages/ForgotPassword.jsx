import React, { useRef, useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useLocation, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [data, setData] = useState({
    email: "",
  });
  //   const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef([]);
  const location = useLocation();

  console.log("location", location);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  console.log("data", data);

  const validateValue = Object.values(data).every((e1) => e1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.forgot_password,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/verification-otp", {
          state: data,
        });
        setData({
          email: "",
        });
      }

      console.log("response", response);
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
        <p className="font-semibold text-lg mb-2">
          Welcome to BlinkIt, You forgot-password, don't worry we are there for
          you!
        </p>
        <form action="" className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="email">Email : </label>
            <input
              type="email"
              name="email"
              id="email"
              className="bg-blue-50 p-2 border rounded outline-none focus:border-primary-200"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          <button
            disabled={!validateValue}
            className={` ${
              validateValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"
            } text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            Send OTP
          </button>
        </form>
        <p>
          Already have account ?{" "}
          <Link
            to={"/login"}
            className="font-semibold text-green-700 hover:text-green-800"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ForgotPassword;
