import React, { useEffect } from "react";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateValue = Object.values(data).every((e1) => e1);

  useEffect(() => {
    if (!location?.state?.data?.success) {
      navigate("/");
    }
    if (location?.state?.email) {
      setData((preve) => {
        return {
          ...preve,
          email: location?.state?.email,
        };
      });
    }
  }, []);

  console.log("data reset password", data);
  console.log("resetPassword Page", location);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.newPassword !== data.confirmPassword) {
      toast.error("New Password & Confirm Password does not match");
    }

    try {
      const response = await Axios({
        ...SummaryApi.resetPassword,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
        setData({
          email: "",
          newPassword: "",
          confirmPassword: "",
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
          Welcome to BlinkIt, Please reset password here!
        </p>
        <form action="" className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="newPassword">New Password : </label>
            <div className="grid gap-1">
              <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200">
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  id="newPassword"
                  className="w-full outline-none"
                  value={data.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                />
                <div
                  onClick={() => setShowPassword((preve) => !preve)}
                  className="cursor"
                >
                  {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-1">
            <label htmlFor="confirmPassword">Confirm Password : </label>
            <div className="grid gap-1">
              <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  className="w-full outline-none"
                  value={data.confirmPassword}
                  onChange={handleChange}
                  placeholder="Enter confirm password"
                />
                <div
                  onClick={() => setShowConfirmPassword((preve) => !preve)}
                  className="cursor"
                >
                  {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </div>
              </div>
            </div>
          </div>
          <button
            disabled={!validateValue}
            className={` ${
              validateValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"
            } text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            Change Password
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

export default ResetPassword;
