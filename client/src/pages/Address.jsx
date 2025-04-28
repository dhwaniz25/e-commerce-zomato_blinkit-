import React, { useState } from "react";
import { useSelector } from "react-redux";
import AddAddress from "../components/AddAddress";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import EditAddressDetails from "../components/EditAddressDetails";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { useGlobalContext } from "../provider/GlobalProvider";

const Address = () => {
  const addressList = useSelector((state) => state.addresses.addressList);
  const [openAddress, setOpenAddress] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const { fetchAddress } = useGlobalContext();

  const handleDisableAddress = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data: {
          _id: id,
        },
      });
      if (response.data.success) {
        toast.success("Successfully removed address");
        if (fetchAddress) {
          await fetchAddress();
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div className="">
      <div className="bg-white shadow-lg px-2 py-2 flex justify-between gap-4 items-center">
        <h2 className="font-semibold text-ellipsis line-clamp-1">Address</h2>
        <button
          onClick={() => setOpenAddress(true)}
          className="border border-primary-100 text-primary-200 px-2 py-1 rounded-full hover:bg-blue-50 hover:text-black"
        >
          Add Address
        </button>
      </div>
      <div className="bg-blue-50 p-2 grid gap-4">
        {addressList.map((address, index) => {
          return (
            <div
              className={`border rounded p-3 flex gap-3 hover:bg-white ${
                !address.status && "hidden"
              }`}
            >
              <div>
                <input
                  id={"address" + index}
                  type="radio"
                  name="address"
                  value={index}
                  onChange={(e) => setSelectAddress(e.target.value)}
                />
              </div>
              <div className="w-full">
                <p>{address.address_line}</p>
                <p>{address.city}</p>
                <p>{address.state}</p>
                <p>
                  {address.country} - {address.pincode}
                </p>
                <p>{address.mobile}</p>
              </div>
              <div className="grid gap-10">
                <button
                  onClick={() => {
                    setOpenEdit(true);
                    setEditData(address);
                  }}
                  className="bg-green-200 p-1 rounded hover:text-white hover:bg-green-600"
                >
                  <MdEdit size={20} />
                </button>
                <button
                  onClick={() => {
                    handleDisableAddress(address._id);
                  }}
                  className="bg-red-200 p-1 rounded hover:text-white hover:bg-red-600"
                >
                  <MdDelete size={20} />
                </button>
              </div>
            </div>
          );
        })}
        <div
          onClick={() => setOpenAddress(true)}
          className="h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center"
        >
          Add Address
        </div>
      </div>
      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
      {openEdit && (
        <EditAddressDetails
          data={editData}
          close={() => {
            setOpenEdit(false);
          }}
        />
      )}
    </div>
  );
};

export default Address;

// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import AddAddress from "../components/AddAddress";
// import { MdDelete, MdEdit } from "react-icons/md";
// import EditAddressDetails from "../components/EditAddressDetails";
// import SummaryApi from "../common/SummaryApi";
// import Axios from "../utils/Axios";
// import toast from "react-hot-toast";
// import AxiosToastError from "../utils/AxiosToastError";
// import { useGlobalContext } from "../provider/GlobalProvider";

// const Address = () => {
//   const addressList = useSelector((state) => state.addresses.addressList);
//   const [openAddress, setOpenAddress] = useState(false);
//   const [openEdit, setOpenEdit] = useState(false);
//   const [editData, setEditData] = useState({});
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const { fetchAddress } = useGlobalContext();

//   const handleDisableAddress = async (id) => {
//     try {
//       const response = await Axios({
//         ...SummaryApi.disableAddress,
//         data: {
//           _id: id,
//         },
//       });
//       if (response.data.success) {
//         toast.success("Successfully removed address");
//         fetchAddress?.();
//       }
//     } catch (error) {
//       AxiosToastError(error);
//     }
//   };

//   return (
//     <div className="address-container">
//       <div className="bg-white shadow-lg px-2 py-2 flex justify-between gap-4 items-center">
//         <h2 className="font-semibold text-ellipsis line-clamp-1">Address</h2>
//         <button
//           onClick={() => setOpenAddress(true)}
//           className="border border-primary-100 text-primary-200 px-2 py-1 rounded-full hover:bg-blue-50 hover:text-black"
//           aria-label="Add new address"
//         >
//           Add Address
//         </button>
//       </div>

//       <div className="bg-blue-50 p-2 grid gap-4">
//         {addressList
//           .filter((address) => address.status)
//           .map((address, index) => (
//             <div
//               key={address._id}
//               className="border rounded p-3 flex gap-3 hover:bg-white"
//             >
//               <div className="flex items-start">
//                 <input
//                   id={`address-${address._id}`}
//                   type="radio"
//                   name="address"
//                   value={address._id}
//                   checked={selectedAddress === address._id}
//                   onChange={() => setSelectedAddress(address._id)}
//                   className="mt-1"
//                 />
//               </div>
//               <div className="w-full">
//                 <label
//                   htmlFor={`address-${address._id}`}
//                   className="cursor-pointer"
//                 >
//                   <p>{address.address_line}</p>
//                   <p>{address.city}</p>
//                   <p>{address.state}</p>
//                   <p>
//                     {address.country} - {address.pincode}
//                   </p>
//                   <p>{address.mobile}</p>
//                 </label>
//               </div>
//               <div className="grid gap-3">
//                 <button
//                   onClick={() => {
//                     setOpenEdit(true);
//                     setEditData(address);
//                   }}
//                   className="bg-green-200 p-1 rounded hover:text-white hover:bg-green-600"
//                   aria-label="Edit address"
//                 >
//                   <MdEdit size={20} />
//                 </button>
//                 <button
//                   onClick={() => handleDisableAddress(address._id)}
//                   className="bg-red-200 p-1 rounded hover:text-white hover:bg-red-600"
//                   aria-label="Delete address"
//                 >
//                   <MdDelete size={20} />
//                 </button>
//               </div>
//             </div>
//           ))}

//         <button
//           onClick={() => setOpenAddress(true)}
//           className="h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center w-full hover:bg-blue-100"
//           aria-label="Add new address"
//         >
//           Add Address
//         </button>
//       </div>

//       {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
//       {openEdit && (
//         <EditAddressDetails data={editData} close={() => setOpenEdit(false)} />
//       )}
//     </div>
//   );
// };

// export default Address;
