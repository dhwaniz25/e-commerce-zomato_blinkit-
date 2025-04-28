import React, { useEffect, useState, useCallback } from "react";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import Loading from "../components/Loading";
import ProductCardAdmin from "../components/ProductCardAdmin";
import { IoSearchSharp } from "react-icons/io5";
import EditProductAdmin from "../components/EditProductAdmin";

const ProductAdmin = () => {
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [search, setSearch] = useState("");

  const fetchProductData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page: page,
          limit: 10,
          search: search,
        },
      });
      const { data: responseData } = response;
      console.log("Response Data from Fetch Product", responseData);

      if (responseData.success) {
        setTotalPageCount(responseData.totalNoOfPage);
        setProductData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchProductData();
  }, [page, fetchProductData]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchProductData();
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [search, fetchProductData]);

  const handleNext = () => {
    if (page !== totalPageCount) {
      setPage((preve) => preve + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage((preve) => preve - 1);
    }
  };

  const handleOnChange = (e) => {
    const { value } = e.target;
    setSearch(value);
    setPage(1);
  };

  console.log("Product data from product admin ", productData);
  console.log("Handle search from product admin", search);

  return (
    <section>
      <div className="p-2 bg-white shadow-md flex items-center justify-between gap-4">
        <h2 className="font-semibold">Product</h2>
        <div className="h-full min-w-24 w-full max-w-56 ml-auto bg-blue-50 px-4 flex items-center gap-3 py-2 rounded border focus-within:border-primary-200">
          <IoSearchSharp size={25} />
          <input
            type="text"
            placeholder="Search Product here..."
            className="h-full w-full outline-none rounded bg-transparent"
            value={search}
            onChange={handleOnChange}
          />
        </div>
      </div>

      {loading && <Loading />}

      <div className="p-4 bg-blue-50">
        <div className="min-h-[55vh]">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {productData.map((p, index) => (
              <ProductCardAdmin
                key={p._id || index}
                data={p}
                fetchProductData={fetchProductData}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-between my-4">
          <button
            type="button"
            onClick={handlePrevious}
            className="border border-primary-200 px-4 py-1 hover:bg-primary-100"
            disabled={page === 1}
          >
            Previous
          </button>
          <button className="w-full bg-white">
            {page}/{totalPageCount}
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="border border-primary-200 px-4 py-1 hover:bg-primary-100"
            disabled={page === totalPageCount}
          >
            Next
          </button>
        </div>
      </div>


    </section>
  );
};

export default ProductAdmin;


// import React, { useEffect, useState } from "react";
// import SummaryApi from "../common/SummaryApi";
// import AxiosToastError from "../utils/AxiosToastError";
// import Axios from "../utils/Axios";
// import Loading from "../components/Loading";
// import ProductCardAdmin from "../components/ProductCardAdmin";
// import { IoSearchSharp } from "react-icons/io5";

// const ProductAdmin = () => {
//   const [productData, setProductData] = useState([]);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [totalPageCount, setTotalPageCount] = useState(1);
//   const [search, setSearch] = useState("");

//   const fetchProductData = async () => {
//     try {
//       setLoading(true);
//       const response = await Axios({
//         ...SummaryApi.getProduct,
//         data: {
//           page: page,
//           limit: 10,
//           search: search,
//         },
//       });
//       const { data: responseData } = response;
//       console.log("Response Data from Fetch Product", responseData);

//       if (responseData.success) {
//         // setTotalPageCount(responseData.totalNoOfPage);
//         setProductData(responseData.data);
//       }
//     } catch (error) {
//       AxiosToastError(error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchProductData();
//   }, [page]);

//   console.log("Product data from product admin ", productData);

//   const handleNext = () => {
//     if (page !== totalPageCount) {
//       setPage((preve) => preve + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (page > 1) {
//       setPage((preve) => preve - 1);
//     }
//   };

//   const handleOnChange = (e) => {
//     const { value } = e.target;
//     setSearch(value);
//     setPage(1)
//   };

//   useEffect(() => {
//     let flag = true
//     const interval = setTimeout(() => {
//       if (flag) {
//         fetchProductData()
//         flag = false
//       }
//     }, 300)

//     return () => {
//       clearTimeout(interval)
//     }
//   },[search])

//   console.log("Handle search from prodcut admin", search);

//   return (
//     <section>
//       <div className="p-2 bg-white shadow-md flex items-center justify-between gap-4">
//         <h2 className="font-semibold">Product</h2>
//         <div className="h-full min-w-24 w-full max-w-56 ml-auto bg-blue-50 px-4 flex items-center gap-3 py-2 rounded border focus-within:border-primary-200">
//           <IoSearchSharp size={25} />
//           <input
//             type="text"
//             placeholder="Search Product here..."
//             className="h-full w-full outline-none rounded bg-transparent"
//             value={search}
//             onChange={handleOnChange}
//           />
//         </div>
//       </div>
//       {loading && <Loading />}

//       <div className="p-4 bg-blue-50 ">
//         <div className="min-h-[55vh]">
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 ">
//             {productData.map((p, index) => {
//               return <ProductCardAdmin data={p} />;
//             })}
//           </div>
//         </div>

//         <div className="flex justify-between my-4">
//           <button
//             onClick={handlePrevious}
//             className="border border-primary-200 px-4 py-1 hover:bg-primary-100"
//           >
//             Previous
//           </button>
//           <button className="w-full bg-white">
//             {page}/{totalPageCount}
//           </button>
//           <button
//             onClick={handleNext}
//             className="border border-primary-200 px-4 py-1 hover:bg-primary-100"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ProductAdmin;