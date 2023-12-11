import React from "react";
import { Grid } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { useSelector } from "react-redux";
import { VTInfo } from "../../redux/selectors";

import "./css/FlightManageListTB.css";

const FlightManageListTB = () => {
  const VTdetail = useSelector(VTInfo);

  console.log("VTdetail", VTdetail);

  const renderTB = () => {
    return (
      <>
        {Object.keys(VTdetail.data).map((nameTB) => {
          // console.log(typeof VTdetail.data[nameTB]);
          var error = false;
          if (VTdetail.data[nameTB].length > 0) {
            error = true;
          }
          if (typeof VTdetail.data[nameTB] !== "string") {
            return (
              <>
                <Grid
                  item
                  xs={12}
                  className={`list-TB__container ${
                    error
                      ? "list-TB__container--error"
                      : "list-TB__container--normal"
                  }`}
                >
                  <div className="list-TB__title">{nameTB}</div>

                  {error === true ? (
                    <CancelIcon fontSize="large" color="error" />
                  ) : (
                    <CheckCircleIcon fontSize="large" color="success" />
                  )}
                </Grid>
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
