import React, { useEffect, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../utils/uploadImage";
import Loading from "../components/Loading";
import ViewImage from "../components/ViewImage";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import AddFieldComponent from "../components/AddFieldComponent";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import successAlert from "../utils/SuccessAlert";

const EditProductAdmin = ({ close, data: propsData, fetchProductData }) => {
  const [data, setData] = useState({
    _id: propsData._id,
    name: propsData.name,
    image: propsData.image,
    category: propsData.category,
    subCategory: propsData.subCategory,
    unit: propsData.unit,
    stock: propsData.stock,
    price: propsData.price,
    discount: propsData.discount,
    description: propsData.description,
    more_details: propsData.more_details || {}, //it is not compulsory that we will always find this field therefore we have kept null object here
  });

  const [imageLoading, setImageLoading] = useState(false);
  const [viewImageUrl, setViewImageUrl] = useState("");
  const allCategory = useSelector((state) => state.product.allCategory);
  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const allSubCategory = useSelector((state) => state.product.allSubCategory);
  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }
    setImageLoading(true);
    const response = await uploadImage(file);
    const { data: ImageResponse } = response;
    const imageUrl = ImageResponse.data.url;

    setData((preve) => {
      return {
        ...preve,
        image: [...preve.image, imageUrl],
      };
    });
    setImageLoading(false);

    console.log("File from upload product page image file", file);
  };

  const handleDeleteImage = async (index) => {
    data.image.splice(index, 1);

    setData((preve) => {
      return {
        ...preve,
      };
    });
  };

  const handleRemoveCategory = async (index) => {
    data.category.splice(index, 1);

    setData((preve) => {
      return {
        ...preve,
      };
    });
  };

  const handleRemoveSubCategory = async (index) => {
    data.subCategory.splice(index, 1);

    setData((preve) => {
      return {
        ...preve,
      };
    });
  };

  const handleAddField = async () => {
    setData((preve) => {
      return {
        ...preve,
        more_details: {
          ...preve.more_details,
          [fieldName]: "",
        },
      };
    });
    setFieldName("");
    setOpenAddField(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Data from product page", data);

    try {
      const response = await Axios({
        ...SummaryApi.updateProductDetails,
        data: data,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        successAlert(responseData.message);
        if (close) {
          close();
        }
        fetchProductData();
        setData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {},
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  return (
    <section className="fixed top-0 bottom-0 right-0 left-0 bg-black z-50 bg-opacity-70 p-4">
      <div className="bg-white w-full p-4 max-w-2xl mx-auto rounded overflow-y-auto h-full max-h-[95vh]">
        <section>
          <div className="p-2 bg-white shadow-md flex items-center justify-between">
            <h2 className="font-semibold">Upload Product</h2>
            <button>
              <IoClose size={20} onClick={close} />
            </button>
          </div>
          <div className="grid p-3">
            <form action="" className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-1">
                <label htmlFor="name" className="font-semibold">
                  Name:
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  value={data.name}
                  required
                  onChange={handleChange}
                  className="bg-blue-50 p-2 outline-none rounded border focus-within:border-primary-200"
                />
              </div>
              <div className="grid gap-1">
                <label htmlFor="description" className="font-semibold">
                  Description:{" "}
                </label>
                <textarea
                  id="description"
                  type="text"
                  name="description"
                  placeholder="Enter product description"
                  value={data.description}
                  required
                  onChange={handleChange}
                  rows={3}
                  className="bg-blue-50 p-2 outline-none rounded border focus-within:border-primary-200 resize-none"
                />
              </div>
              <div>
                <p className="font-semibold">Image: </p>
                <div>
                  <label
                    htmlFor="productImage"
                    className="bg-blue-50 h-24 border rounded flex items-center justify-center cursor-pointer"
                  >
                    <div className="text-center flex justify-center items-center flex-col">
                      {imageLoading ? (
                        <Loading />
                      ) : (
                        <>
                          <FaCloudUploadAlt size={35} />
                          <p>Upload Image</p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      id="productImage"
                      name="productImage"
                      className="hidden"
                      accept="image/*"
                      onChange={handleUploadImage}
                    />
                  </label>
                  {/* display uploaded images */}
                  <div className="flex flex-wrap gap-4">
                    {data.image.map((img, index) => {
                      return (
                        <div
                          key={img + index}
                          className="h-20 w-20 min-w-20 mt-1 bg-blue-50 border relative group"
                        >
                          <img
                            src={img}
                            alt={img}
                            className="w-full h-full object-scale-down cursor-pointer border-primary-200"
                            onClick={() => setViewImageUrl(img)}
                          />
                          <div
                            onClick={() => handleDeleteImage(index)}
                            className="absolute bottom-0 right-0 p-1 bg-red-500 hover:bg-red-600 rounded text-white hidden group-hover:block cursor-pointer"
                          >
                            <MdDelete size={20} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="grid gap-1">
                <label htmlFor="" className="font-semibold">
                  Category:
                </label>
                <div>
                  <select
                    name=""
                    id=""
                    className="bg-blue-50 border w-full p-2 rounded border-primary-200"
                    value={selectCategory}
                    onChange={(e) => {
                      const value = e.target.value;
                      const category = allCategory.find(
                        (el) => el._id === value
                      );
                      console.log("Value from product select category", value);
                      console.log(
                        "Category Value from product select category",
                        category
                      );
                      setData((preve) => {
                        return {
                          ...preve,
                          category: [...preve.category, category],
                        };
                      });
                      setSelectCategory("");
                    }}
                  >
                    <option value="">Select Category</option>
                    {allCategory.map((c, index) => {
                      return <option value={c._id}>{c.name}</option>;
                    })}
                  </select>
                  <div className="flex flex-wrap gap-3">
                    {data.category.map((c, index) => {
                      return (
                        <div
                          key={c._id + index + "productsection"}
                          className="text-sm flex items-center gap-1 bg-blue-50 mt-1"
                        >
                          <p>{c.name}</p>
                          <div
                            className="hover:text-red-500 cursor-pointer"
                            onClick={() => handleRemoveCategory(index)}
                          >
                            <IoClose size={20} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="grid gap-1">
                <label htmlFor="" className="font-semibold">
                  Sub Category:
                </label>
                <div>
                  <select
                    name=""
                    id=""
                    className="bg-blue-50 border w-full p-2 rounded border-primary-200"
                    value={selectSubCategory}
                    onChange={(e) => {
                      const value = e.target.value;
                      const subCategory = allSubCategory.find(
                        (el) => el._id === value
                      );
                      console.log(
                        "Value from product select sub category",
                        value
                      );
                      console.log(
                        "Category Value from product select sub category",
                        subCategory
                      );
                      setData((preve) => {
                        return {
                          ...preve,
                          subCategory: [...preve.subCategory, subCategory],
                        };
                      });
                      setSelectSubCategory("");
                    }}
                  >
                    <option value="">Select Sub Category</option>
                    {allSubCategory.map((c, index) => {
                      return <option value={c?._id}>{c.name}</option>;
                    })}
                  </select>
                  <div className="flex flex-wrap gap-3">
                    {data.subCategory.map((c, index) => {
                      return (
                        <div
                          key={c._id + index + "productsection"}
                          className="text-sm flex items-center gap-1 bg-blue-50 mt-1"
                        >
                          <p>{c.name}</p>
                          <div
                            className="hover:text-red-500 cursor-pointer"
                            onClick={() => handleRemoveSubCategory(index)}
                          >
                            <IoClose size={20} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="grid gap-1">
                <label htmlFor="unit" className="font-semibold">
                  Unit:
                </label>
                <input
                  id="unit"
                  type="text"
                  name="unit"
                  placeholder="Enter product unit"
                  value={data.unit}
                  required
                  onChange={handleChange}
                  className="bg-blue-50 p-2 outline-none rounded border focus-within:border-primary-200"
                />
              </div>
              <div className="grid gap-1">
                <label htmlFor="stock" className="font-semibold">
                  Number of Stock :
                </label>
                <input
                  id="stock"
                  type="number"
                  name="stock"
                  placeholder="Enter product stock"
                  value={data.stock}
                  required
                  onChange={handleChange}
                  className="bg-blue-50 p-2 outline-none rounded border focus-within:border-primary-200"
                />
              </div>
              <div className="grid gap-1">
                <label htmlFor="price" className="font-semibold">
                  Price:
                </label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  placeholder="Enter product price"
                  value={data.price}
                  required
                  onChange={handleChange}
                  className="bg-blue-50 p-2 outline-none rounded border focus-within:border-primary-200"
                />
              </div>
              <div className="grid gap-1">
                <label htmlFor="discount" className="font-semibold">
                  Discount:
                </label>
                <input
                  id="discount"
                  type="number"
                  name="discount"
                  placeholder="Enter product discount"
                  value={data.discount}
                  required
                  onChange={handleChange}
                  className="bg-blue-50 p-2 outline-none rounded border focus-within:border-primary-200"
                />
              </div>

              <div>
                {Object?.keys(data?.more_details)?.map((k, index) => {
                  return (
                    <div className="grid gap-1">
                      <label htmlFor={k} className="font-semibold">
                        {k}
                      </label>
                      <input
                        id={k}
                        type="text"
                        value={data?.more_details[k]}
                        required
                        onChange={(e) => {
                          const value = e.target.value;
                          setData((preve) => {
                            return {
                              ...preve,
                              more_details: {
                                ...preve.more_details,
                                [k]: value,
                              },
                            };
                          });
                        }}
                        className="bg-blue-50 p-2 outline-none rounded border focus-within:border-primary-200"
                      />
                    </div>
                  );
                })}
              </div>

              <div
                onClick={() => setOpenAddField(true)}
                className="bg-white hover:bg-primary-200 py-1 px-3 w-32 text-center cursor-pointer font-semibold border-primary-100 hover:text-neutral-900 rounded"
              >
                Add Fields
              </div>
              <button className="bg-primary-100 hover:bg-primary-200 py-2 rounded font-semibold">
                Update Product Details
              </button>
            </form>
          </div>

          {viewImageUrl && (
            <ViewImage url={viewImageUrl} close={() => setViewImageUrl("")} />
          )}

          {openAddField && (
            <AddFieldComponent
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              submit={handleAddField}
              close={() => setOpenAddField(false)}
            />
          )}
        </section>
      </div>
    </section>
  );
};

export default EditProductAdmin;
