import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { useSelector } from "react-redux";
import { VTInfo } from "../../redux/selectors";

import "./css/FlightManageListTB.css";

const FlightManageListTB = () => {
  const VTdetail = useSelector(VTInfo);
  const renderTB = () => {
    return (
      <>
        {Object.keys(VTdetail.data).map((nameTB) => {
          const hasDefect = VTdetail.data[nameTB].length > 0;
          if (typeof VTdetail.data[nameTB] !== "string") {
            return (
              <>
                <div
                  className={`list-TB__container ${
                    hasDefect
                      ? "list-TB__container--error"
                      : "list-TB__container--normal"
                  }`}
                >
                  <div className="list-TB__title">{nameTB}</div>

                  {hasDefect === true ? (
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

  return <>{VTdetail && VTdetail.data && renderTB()}</>;
};

export default FlightManageListTB;
