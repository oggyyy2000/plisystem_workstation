import React, { useState } from "react";
import Slider from "react-slick";
// import img4 from "../../assets/images/anh4.png";
import thermalImg1 from "../../assets/images/ThermalIMG/DJI_0926_T.JPG";
import thermalImg2 from "../../assets/images/ThermalIMG/DJI_0928_T.JPG";
import thermalImg3 from "../../assets/images/ThermalIMG/DJI_0930_T.JPG";
import thermalImg4 from "../../assets/images/ThermalIMG/DJI_0932_T.JPG";
import thermalImg5 from "../../assets/images/ThermalIMG/DJI_0935_T.JPG";
import thermalImg6 from "../../assets/images/ThermalIMG/DJI_0938_T.JPG";
import thermalImg7 from "../../assets/images/ThermalIMG/DJI_0943_T.JPG";
import thermalImg8 from "../../assets/images/ThermalIMG/DJI_0945_T.JPG";
import thermalImg9 from "../../assets/images/ThermalIMG/DJI_0948_T.JPG";

import rgbImg1 from "../../assets/images/RGBIMG/DJI_0925_W.JPG";
import rgbImg2 from "../../assets/images/RGBIMG/DJI_0927_W.JPG";
import rgbImg3 from "../../assets/images/RGBIMG/DJI_0929_W.JPG";
import rgbImg4 from "../../assets/images/RGBIMG/DJI_0931_W.JPG";
import rgbImg5 from "../../assets/images/RGBIMG/DJI_0933_W.JPG";
import rgbImg6 from "../../assets/images/RGBIMG/DJI_0934_W.JPG";
import rgbImg7 from "../../assets/images/RGBIMG/DJI_0936_W.JPG";
import rgbImg8 from "../../assets/images/RGBIMG/DJI_0937_W.JPG";
import rgbImg9 from "../../assets/images/RGBIMG/DJI_0942_W.JPG";

import "./css/FlightManageImageSlider.css";

// import { useSelector } from "react-redux";
// import { VTInfo } from "../../redux/selectors";

const imgList = [
  thermalImg1,
  thermalImg2,
  thermalImg3,
  thermalImg4,
  thermalImg5,
  thermalImg6,
  thermalImg7,
  thermalImg8,
  thermalImg9,
];

const imgList3 = [
  rgbImg1,
  rgbImg2,
  rgbImg3,
  rgbImg4,
  rgbImg5,
  rgbImg6,
  rgbImg7,
  rgbImg8,
  rgbImg9,
];

const FlightManageImageSlider = () => {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  // const [imgList2, setImgList2] = useState([]);
  // const VTdetail = useSelector(VTInfo);
  // console.log(VTdetail);

  // function getIMG() {
  //   const imgList2 = [];
  //   setImgList2(imgList2);
  //   console.log(imgList2);

  //   for (var keys in VTdetail.data) {
  //     if (typeof VTdetail.data[keys] !== "string") {
  //       VTdetail.data[keys].forEach((item) => {
  //         item.defect_image.map((list) => {
  //           return imgList2.push(process.env.REACT_APP_IMG + `${list}`);
  //         });
  //       });
  //     }
  //   }
  // }

  // useEffect(() => {
  //   getIMG();
  // }, [VTdetail]);

  //co the render bang fuction nhung gap loi k the return ra slide ma tat ca anh
  //xep thanh 1 cot
  // function renderIMG() {
  //   // console.log(imgList2)
  //   return (
  //     <>
  //       {imgList2.map((img) => {
  //         return (
  //           <>
  //             <div
  //               style={{
  //                 padding: "1px",
  //                 textAlign: "center",
  //                 display: "flex",
  //                 justifyContent: "center",
  //               }}
  //             >
  //               <img
  //                 src={`${img}`}
  //                 alt="img"
  //                 style={{ maxWidth: "537px", maxHeight: "272px" }}
  //               />
  //             </div>
  //           </>
  //         );
  //       })}
  //     </>
  //   );
  // }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <>
      {/* Slider 1 */}
      <div style={{ margin: "1rem 0 0 0.625rem" }}>
        <Slider
          {...settings}
          asNavFor={nav2}
          ref={(slider1) => setNav1(slider1)}
        >
          {/* {JSON.stringify(VTdetail.data) !== "{}" && imgList2.length > 0 ? (
            imgList2.map((img) => {
              return (
                <>
                  <div className="home-slide">
                    <img
                      src={`${img}`}
                      alt="img"
                      style={{ maxWidth: "537px", maxHeight: "272px" }}
                    />
                  </div>
                </>
              );
            })
          ) : (
            <>
              <div className="home-slide">
                <img
                  src={noProblem}
                  alt="img"
                  style={{ maxWidth: "537px", maxHeight: "272px" }}
                />
              </div>
            </>
          )} */}
          {imgList3.map((img) => {
            return (
              <>
                <div className="error-image-slide">
                  <img
                    src={`${img}`}
                    alt="img"
                    style={{ maxWidth: "561px", maxHeight: "272px" }}
                  />
                </div>
              </>
            );
          })}
        </Slider>
      </div>

      {/* Slider 2 */}
      <div style={{ margin: "3rem 0 0 0.625rem" }}>
        <Slider
          {...settings}
          asNavFor={nav1}
          ref={(slider2) => setNav2(slider2)}
        >
          {imgList.map((img) => {
            return (
              <>
                <div
                  style={{
                    padding: "1px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={`${img}`}
                    alt="img"
                    style={{ maxWidth: "561px", maxHeight: "272px" }}
                  />
                </div>
              </>
            );
          })}
        </Slider>
      </div>
    </>
  );
};

export default FlightManageImageSlider;
