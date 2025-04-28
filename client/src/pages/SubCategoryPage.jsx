// import React, { useEffect, useState } from "react";
// import UploadSubCategoryModel from "../components/UploadSubCategoryModel";
// import AxiosToastError from "../utils/AxiosToastError";
// import Axios from "../utils/Axios";
// import SummaryApi from "../common/SummaryApi";
// import DisplayTable from "../components/DisplayTable";
// import { createColumnHelper } from "@tanstack/react-table";
// import ViewImage from "../components/ViewImage";
// import { HiPencil } from "react-icons/hi";
// import { MdDelete } from "react-icons/md";
// import EditSubCategory from "../components/EditSubCategory";
// import ConfrimBox from "../components/ConfirmBox";
// import toast from "react-hot-toast";

// const SubCategoryPage = () => {
//   const [openAddSubCategory, setOpenAddSubCategory] = useState(false);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [imageURL, setImageURL] = useState("");
//   const [openEdit, setOpenEdit] = useState(false);
//   const [editData, setEditData] = useState({
//     _id: "",
//   });
//   const [deleteSubCategory, setDeleteSubCategory] = useState({
//     _id: "",
//   });
//   const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);

//   const columnHelper = createColumnHelper();

//   const fetchSubCategory = async () => {
//     try {
//       setLoading(true);
//       const response = await Axios({
//         ...SummaryApi.getSubCategory,
//       });
//       const { data: responseData } = response;
//       if (responseData.success) {
//         setData(responseData.data);
//       }
//     } catch (error) {
//       AxiosToastError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSubCategory();
//   }, []);

//   console.log("Sub Category Data", data);

//   const column = [
//     columnHelper.accessor("name", {
//       header: "Name",
//     }),
//     columnHelper.accessor("image", {
//       header: "Image",
//       cell: ({ row }) => {
//         console.log("Row from subcategory page", row.original);
//         return (
//           <div className="flex justify-center items-center">
//             <img
//               src={row.original.image}
//               alt={row.original.name}
//               className="h-8 w-8 cursor-pointer"
//               onClick={() => {
//                 setImageURL(row.original.image);
//               }}
//             />
//           </div>
//         );
//       },
//     }),
//     columnHelper.accessor("category", {
//       header: "Category",
//       cell: ({ row }) => {
//         return (
//           <>
//             {row.original.category.map((c, index) => {
//               return (
//                 <p
//                   key={c._id + "table"}
//                   className="shadow-md px-1 inline-block"
//                 >
//                   {c.name}
//                 </p>
//               );
//             })}
//           </>
//         );
//       },
//     }),
//     columnHelper.accessor("_id", {
//       header: "Action",
//       cell: ({ row }) => {
//         return (
//           <div className="flex items-center justify-center gap-3">
//             <button
//               onClick={() => {
//                 setOpenEdit(true);
//                 setEditData(row.original);
//               }}
//               className="p-2 bg-green-100 rounded-full hover:text-green-600 text-green-500"
//             >
//               <HiPencil size={20} />
//             </button>
//             <button
//               onClick={() => {
//                 setOpenDeleteConfirmBox(true);
//                 setDeleteSubCategory(row.original);
//               }}
//               className="p-2 bg-red-100 rounded-full hover:text-red-600 text-red-500"
//             >
//               <MdDelete size={20} />
//             </button>
//           </div>
//         );
//       },
//     }),
//   ];

//   const handelDeleteSubCategory = async () => {
//     try {
//       const response = await Axios({
//         ...SummaryApi.deleteSubCategory,
//         data: deleteSubCategory,
//       });
//       const { data: responseData } = response;

//       if (responseData.success) {
//         toast.success(responseData.message);
//         fetchSubCategory();
//         setOpenDeleteConfirmBox(false);
//         setDeleteSubCategory({ _id: "" });
//       }
//     } catch (error) {
//       AxiosToastError(error);
//     }
//   };

//   return (
//     <section>
//       <div className="p-2 bg-white shadow-md flex items-center justify-between">
//         <h2 className="font-semibold">Sub Category</h2>
//         <button
//           onClick={() => setOpenAddSubCategory(true)}
//           className="text-sm border border-primary-200 hover:bg-primary-100 px-3 py-1 rounded"
//         >
//           Add Sub Category
//         </button>
//       </div>

//       <div>
//         <DisplayTable data={data} column={column} />
//       </div>

//       {openAddSubCategory && (
//         <UploadSubCategoryModel
//           close={() => setOpenAddSubCategory(false)}
//           fetchData={fetchSubCategory}
//         />
//       )}

//       {imageURL && <ViewImage url={imageURL} close={() => setImageURL("")} />}

//       {openEdit && (
//         <EditSubCategory
//           data={editData}
//           close={() => setOpenEdit(false)}
//           fetchData={fetchSubCategory}
//         />
//       )}

//       {openDeleteConfirmBox && (
//         <ConfrimBox
//           cancel={() => setOpenDeleteConfirmBox(false)}
//           close={() => setOpenDeleteConfirmBox(false)}
//           confirm={handelDeleteSubCategory}
//         />
//       )}
//     </section>
//   );
// };

// export default SubCategoryPage;

import React, { useEffect, useState } from "react";
import UploadSubCategoryModel from "../components/UploadSubCategoryModel";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import DisplayTable from "../components/DisplayTable";
import { createColumnHelper } from "@tanstack/react-table";
import ViewImage from "../components/ViewImage";
import { HiPencil } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import EditSubCategory from "../components/EditSubCategory";
import ConfrimBox from "../components/ConfirmBox";
import toast from "react-hot-toast";

const SubCategoryPage = () => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({ _id: "" });
  const [deleteSubCategory, setDeleteSubCategory] = useState({ _id: "" });
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);

  const columnHelper = createColumnHelper();

  const fetchSubCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios(SummaryApi.getSubCategory);
      const { data: responseData } = response;
      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategory();
  }, []);

  const handelDeleteSubCategory = async () => {
    try {
      // Optimistic update - remove immediately from UI
      const deletedId = deleteSubCategory._id;
      setData((prevData) => prevData.filter((item) => item._id !== deletedId));

      const response = await Axios({
        ...SummaryApi.deleteSubCategory,
        data: deleteSubCategory,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);

        fetchSubCategory();
        // setOpenDeleteConfirmBox(false);
        // setDeleteSubCategory({ _id: "" });
      }
    } catch (error) {
      // Revert on error
      fetchSubCategory();
      AxiosToastError(error);
    } finally {
      setOpenDeleteConfirmBox(false);
      setDeleteSubCategory({ _id: "" });
    }
  };

  const column = [
    columnHelper.accessor("name", {
      header: "Name",
    }),
    columnHelper.accessor("image", {
      header: "Image",
      cell: ({ row }) => (
        <div className="flex justify-center items-center">
          <img
            src={row.original.image}
            alt={row.original.name}
            className="h-8 w-8 cursor-pointer"
            onClick={() => setImageURL(row.original.image)}
          />
        </div>
      ),
    }),
    columnHelper.accessor("category", {
      header: "Category",
      cell: ({ row }) => (
        <>
          {row.original.category.map((c) => (
            <p key={c._id + "table"} className="shadow-md px-1 inline-block">
              {c.name}
            </p>
          ))}
        </>
      ),
    }),
    columnHelper.accessor("_id", {
      header: "Action",
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => {
              setOpenEdit(true);
              setEditData(row.original);
            }}
            className="p-2 bg-green-100 rounded-full hover:text-green-600 text-green-500"
          >
            <HiPencil size={20} />
          </button>
          <button
            onClick={() => {
              setOpenDeleteConfirmBox(true);
              setDeleteSubCategory(row.original);
            }}
            className="p-2 bg-red-100 rounded-full hover:text-red-600 text-red-500"
          >
            <MdDelete size={20} />
          </button>
        </div>
      ),
    }),
  ];

  return (
    <section>
      <div className="p-2 bg-white shadow-md flex items-center justify-between">
        <h2 className="font-semibold">Sub Category</h2>
        <button
          onClick={() => setOpenAddSubCategory(true)}
          className="text-sm border border-primary-200 hover:bg-primary-100 px-3 py-1 rounded"
        >
          Add Sub Category
        </button>
      </div>

      <div className="overflow-auto w-full max-w-[95vw]">
        <DisplayTable data={data} column={column} loading={loading} />
      </div>

      {openAddSubCategory && (
        <UploadSubCategoryModel
          close={() => setOpenAddSubCategory(false)}
          fetchData={fetchSubCategory}
        />
      )}

      {imageURL && <ViewImage url={imageURL} close={() => setImageURL("")} />}

      {openEdit && (
        <EditSubCategory
          data={editData}
          close={() => setOpenEdit(false)}
          fetchData={fetchSubCategory}
        />
      )}

      {openDeleteConfirmBox && (
        <ConfrimBox
          cancel={() => setOpenDeleteConfirmBox(false)}
          close={() => setOpenDeleteConfirmBox(false)}
          confirm={handelDeleteSubCategory}
        />
      )}
    </section>
  );
};

export default SubCategoryPage;
