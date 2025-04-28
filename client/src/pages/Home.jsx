import React from "react";
import banner from "../assets/banner.jpg";
import bannerMobile from "../assets/banner-mobile.jpg";
import { useSelector } from "react-redux";
import { validUrlConvert } from "../utils/validUrlConvert";
import { Link, useNavigate } from "react-router-dom";
import CategoryWiseProductDisplay from "../components/CategoryWiseProductDisplay";

const Home = () => {
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector((state) => state.product.allSubCategory);
  const navigate = useNavigate();
  const handleRedirectProductListPage = async (id, cat) => {
    console.log("Id & Cat from Home Page", id, cat);
    const subCategory = subCategoryData.find((sub) => {
      const filterData = sub.category.some((c) => {
        console.log(sub);
        return c._id == id;
      });
      return filterData ? true : null;
    });
    // const url = "/" + cat + "-" + id;
    const url = `/${validUrlConvert(cat)}-${id}/${validUrlConvert(
      subCategory.name
    )}-${subCategory._id}`;
    navigate(url);
    console.log("SubCategory", subCategory);
    console.log("URL from Home Page", url);
  };
  return (
    <section className="bg-white">
      <div className="container mx-auto">
        <div
          className={`w-full h-full min-h-48 rounded ${
            //bg-blue-100 no need yo add this color in background but if i want i can add it
            !banner && "animate-pulse my-2"
          } `}
        >
          <img
            src={banner}
            alt="banner"
            className="w-full h-full hidden lg:block"
          />
          <img
            src={bannerMobile}
            alt="bannerMobile"
            className="w-full h-full lg:hidden"
          />
        </div>
      </div>
      <div className="container mx-auto px-4 my-2 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {loadingCategory
          ? //new Array(12) --> this is for making 10 new box or space on home page in container
            new Array(12).fill(null).map((c, index) => {
              return (
                <div
                  key={index + "loadingcategory"}
                  className="bg-white rounded p-4 min-h-36 grid gap-2 shadow-md animate-pulse"
                >
                  <div className="bg-blue-100 min-h-24 rounded"></div>
                  <div className="bg-blue-100 h-8 rounded"></div>
                </div>
              );
            })
          : categoryData.map((cat, index) => {
              return (
                <div
                  key={cat._id + "displayCategory"}
                  className="w-full h-full"
                  onClick={() =>
                    handleRedirectProductListPage(cat._id, cat.name)
                  }
                >
                  <div>
                    <img
                      src={cat.image}
                      alt=""
                      className="w-full h-full object-scale-down"
                    />
                  </div>
                </div>
              );
            })}
      </div>

      {/* display category product */}

      {categoryData.map((c, index) => {
        return (
          <CategoryWiseProductDisplay
            id={c?._id}
            name={c?.name}
            key={c._id + "CategoryWiseProduct"}
          />
        );
      })}
    </section>
  );
};

export default Home;
