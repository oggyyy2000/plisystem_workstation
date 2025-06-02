import React from "react";

import {
  Box,
  Typography,
  ImageList,
  ImageListItem,
  TextField,
  Pagination,
  Button,
} from "@mui/material";
import PropTypes from "prop-types";

import CropFreeIcon from "@mui/icons-material/CropFree";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

import EditImageInfoDialog from "../CommonDialog/EditImageInfoDialog";
import "./css/ListImageResult.css";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const ListImageResult = ({
  imgList,
  tab,
  page,
  totalPages,
  setLabelChanged,
  type_ticket,
  suggestOptionEditLabel,
  selectedLabels,
  setOpenZoomingImg,
  handleLabelClick,
  handlePageChange,
}) => {
  console.log("imgListListImageResult: ", imgList);
  const imagesPerPage = 12; // Number of images per page
  return Object.keys(imgList).map((vt, index) => {
    return (
      <CustomTabPanel key={index} value={tab} index={index}>
        <ImageList className="img-list-items-container">
          {imgList[vt]
            .slice((page - 1) * imagesPerPage, page * imagesPerPage) // --------- xu ly pagination --------
            ?.map((info, index) => {
              return (
                <>
                  <ImageListItem sx={{ padding: "2px" }} key={index}>
                    <TextField
                      label="Tình trạng"
                      value={info.image_title}
                      multiline
                      maxRows={1}
                      style={{
                        width: "40%",
                        marginTop: "7px",
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "#000000", // Ghi đè màu chữ khi disabled
                          color: "#000000",
                        },
                        "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline":
                          {
                            borderColor: "rgba(0, 0, 0, 0.23)", // Giữ border màu như bình thường
                          },
                      }}
                      InputProps={{
                        style: {
                          height: "35px", // Set the input height here
                        },
                        endAdornment: (
                          <EditImageInfoDialog
                            info={info}
                            setLabelChanged={setLabelChanged}
                            type_ticket={type_ticket}
                            suggestOptionEditLabel={suggestOptionEditLabel}
                          />
                        ),
                      }}
                      disabled
                    />

                    <div
                      className={`img-list-items-label ${
                        info.sent_status === "sent" ? "hadsubmitted" : ""
                      } ${
                        selectedLabels.includes(info.image_id) ||
                        info.sent_status === "sent"
                          ? "choosed"
                          : ""
                      }`}
                    >
                      <Button
                        className="zoom-btn"
                        variant="outlined"
                        onClick={() =>
                          setOpenZoomingImg(
                            process.env.REACT_APP_IMG + info.image_path
                          )
                        }
                      >
                        <CropFreeIcon color="action" />
                      </Button>
                      <img
                        src={process.env.REACT_APP_IMG + info.image_path}
                        srcSet={process.env.REACT_APP_IMG + info.image_path}
                        alt={info.image_label}
                        loading="lazy"
                        width={"100%"}
                        height={"100%"}
                        onClick={() => handleLabelClick(info.image_id)}
                      />

                      {info.sent_status === "sent" && (
                        <MarkEmailReadIcon
                          className="icon-hadsent"
                          color="info"
                          fontSize="large"
                        />
                      )}
                    </div>

                    {selectedLabels.includes(info.image_id) &&
                      info.sent_status === "not_sent" && (
                        <div className="checkmark-hadchoosed"></div>
                      )}
                  </ImageListItem>
                </>
              );
            })}
        </ImageList>

        <Pagination
          variant="outlined"
          shape="rounded"
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          sx={{ display: "flex", justifyContent: "center", mt: 2 }}
        />
      </CustomTabPanel>
    );
  });
};

export default ListImageResult;
