import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { useSelector } from "react-redux";
import { VTInfo } from "../../redux/selectors";

import "./css/FlightManageListTB.css";

// Assuming you have a translation function or dictionary available
const translateToVietnamese = (englishTerm) => {
  // Implement your translation logic here, using a dictionary, API, or other means
  // For example, you could use a lookup table or an external translation service
  const translations = {
    daydien: "dây điện",
    cachdientt: "cách điện",
    cotthephinh: "cột điện",
    tacr: "tạ chống rung",
    daycs: "dây chống sét",
    hanhlang: "hành lang",
  };
  return translations[englishTerm] || englishTerm; // Fallback to original term if not found
};

const FlightManageListTB = () => {
  const VTdetail = useSelector(VTInfo);

  console.log("VTdetail", VTdetail);

  const renderTB = () => {
    return (
      <>
        {Object.keys(VTdetail.data).map((nameTB) => {
          // console.log(typeof VTdetail.data[nameTB]);
          const translatedNameTB = translateToVietnamese(nameTB);
          const hasData = VTdetail.data[nameTB].length > 0;
          // var error = false;
          // if (VTdetail.data[nameTB].length > 0) {
          //   error = true;
          // }
          if (typeof VTdetail.data[nameTB] !== "string") {
            return (
              <>
                <div
                  className={`list-TB__container ${
                    hasData
                      ? "list-TB__container--error"
                      : "list-TB__container--normal"
                  }`}
                >
                  <div className="list-TB__title">{translatedNameTB}</div>

                  {hasData === true ? (
                    <CancelIcon fontSize="large" color="error" />
                  ) : (
                    <CheckCircleIcon fontSize="large" color="success" />
                  )}
                </div>
              </>
            );
          } else {
            return <>DATA UPDATING !</>;
          }
        })}
      </>
    );
  };

  return <>{JSON.stringify(VTdetail) !== "{}" && renderTB()}</>;
};

export default FlightManageListTB;
