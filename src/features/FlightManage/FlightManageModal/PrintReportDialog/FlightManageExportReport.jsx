import React, { useRef } from "react";
import ReactToPrint from "react-to-print";

import { Button } from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";

import FlightManageFormReport from "./FlightManageFormReport";

export default function FlightManageExportReport({
  staff1,
  staff2,
  staff3,
  staff4,
  reportData,
}) {
  const componentRef = useRef();
  class ComponentToPrint extends React.PureComponent {
    render() {
      return (
        <FlightManageFormReport
          staff1={staff1}
          staff2={staff2}
          staff3={staff3}
          staff4={staff4}
          reportData={reportData}
        />
      );
    }
  }

  return (
    <>
      <ReactToPrint
        trigger={() => (
          <Button component={"C"} variant="contained">
            In Báo Cáo
            <PrintIcon />
          </Button>
        )}
        content={() => componentRef.current}
      />
      <div style={{ display: "none" }}>
        <ComponentToPrint ref={componentRef} />
      </div>
    </>
  );
}
