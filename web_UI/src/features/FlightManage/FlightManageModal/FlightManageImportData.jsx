import React, { useEffect, useRef, useState } from "react";

import { toast } from "react-toastify";
import * as PowerlineLocationService from "../../../APIServices/PowerlineLocationService";
import * as ImportImageService from "../../../APIServices/ImportImageService";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Autocomplete,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "../../../assets/images/can_trash_icon.png";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import styles from "./css/FlightManageImportData.module.css";
import Loading from "../../../components/LoadingPage/LoadingPage";

const FlightManageImportData = ({
  powerline_id,
  type_ticket,
  setTab,
  schedule_id,
  setHadImportNewData,
  suggestOptions,
}) => {
  const [openImportDataDialog, setOpenImportDataDialog] = useState(false);
  const [poleId, setPoleId] = useState([]);

  const [imagesFiles, setImagesFiles] = useState([]);
  const [imagesInfo, setImagesInfo] = useState([]);

  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedImgIndex, setSelectedImgIndex] = useState(null);

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // check variable change
  const [hasDeleteImg, setHasDeleteImg] = useState(false);
  const [sendClicked, setSendClicked] = useState(false);

  useEffect(() => {
    setSendClicked(false);
    const getAllPole = async () => {
      const response = await PowerlineLocationService.getData(powerline_id);
      if (response) {
        setPoleId(response);
      }
    };
    getAllPole();
  }, [powerline_id]);

  useEffect(() => {
    setTab(0);
  }, [setTab, imagesInfo]);

  useEffect(() => {
    if (hasDeleteImg === true) {
      setSelectedImg(null);
      setHasDeleteImg(false);
    }
  }, [hasDeleteImg]);

  // translate to Vietnamese function
  const transformDataToDictionary = (data) => {
    const translations = {};

    for (const category in data) {
      const subCategory = data[category];
      for (const key in subCategory) {
        const term = subCategory[key];
        translations[key] = term.name_v;
      }
    }

    return translations;
  };

  const translateToVietnamese = (englishTerm) => {
    const translations = transformDataToDictionary(suggestOptions);
    return translations[englishTerm] || englishTerm;
  };

  const selectFiles = () => {
    fileInputRef.current.click();
  };

  const handleFileSelectOnChange = async (e) => {
    const files = e.target.files;
    setImagesFiles((prevFiles) => [...prevFiles, ...e.target.files]);

    // Ensure file selection exists and prevent unnecessary loops
    if (files.length === 0) return;

    try {
      const newImages = [];
      // const newImagesToSent = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.split("/")[0] === "image") {
          console.warn("Invalid file type:", file.name);
          continue; // Skip non-image files
        }

        // Check for duplicate names (enhanced uniqueness handling)
        const existingIndex = imagesInfo.findIndex(
          (image) => image.name === file.name
        );
        if (existingIndex !== -1) {
          console.warn("Duplicate file:", file.name);
          continue; // Skip duplicate files
        }

        //powerline_id, date, docNo, type
        //powerline_id, implementation_date, docNo, type_ticket

        const newImage = {
          dataShowImg: {
            name: file.name,
            url: URL.createObjectURL(file),
          },
          [file.name]: {
            label: null,
            title: null,
            location: null,
            // status: null,
          },
        };
        newImages.push(newImage);
      }

      // Update state with new and existing images, ensuring immutability
      setImagesInfo((prevImages) => [...prevImages, ...newImages]);
      // setTestSentImg((prevSentImg) => [...prevSentImg, ...newImagesToSent]);
    } catch (error) {
      console.error("Error handling files:", error);
    }
  };

  const handleDeleteImages = (index) => {
    setImagesInfo((prevImages) => prevImages.filter((_, i) => i !== index));
    const prevFiles = imagesFiles ? [...imagesFiles] : [];
    const filesAfterDelete = prevFiles.filter((_, i) => i !== index);
    setImagesFiles(filesAfterDelete);
    setHasDeleteImg(true);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
    event.dataTransfer.dropEffect = "copy";
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;

    setImagesFiles((prevFiles) => [...prevFiles, ...event.dataTransfer.files]);

    // Ensure file selection exists and prevent unnecessary loops
    if (files.length === 0) return;

    try {
      const newImages = [];
      // const newImagesToSent = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.split("/")[0] === "image") {
          console.warn("Invalid file type:", file.name);
          continue; // Skip non-image files
        }

        // Check for duplicate names (enhanced uniqueness handling)
        const existingIndex = imagesInfo.findIndex(
          (image) => image.name === file.name
        );
        if (existingIndex !== -1) {
          console.warn("Duplicate file:", file.name);
          continue; // Skip duplicate files
        }

        //powerline_id, date, docNo, type
        //powerline_id, implementation_date, docNo, type_ticket

        const newImage = {
          dataShowImg: {
            name: file.name,
            url: URL.createObjectURL(file),
          },
          [file.name]: {
            label: null,
            title: null,
            location: null,
            // status: null,
          },
        };
        newImages.push(newImage);
      }

      // Update state with new and existing images, ensuring immutability
      setImagesInfo((prevImages) => [...prevImages, ...newImages]);
      // setTestSentImg((prevSentImg) => [...prevSentImg, ...newImagesToSent]);
    } catch (error) {
      console.error("Error handling files:", error);
    }
  };

  const onChangeSelectPoleId = (e) => {
    //TODO
    // setSelectedPoleId(poleId ? poleId : "");
    setSelectedImg((prevSelectedImg) => ({
      ...prevSelectedImg,
      [selectedImg.dataShowImg.name]: {
        ...selectedImg[selectedImg.dataShowImg.name],
        location: `${e.target.value}`,
      },
    }));
  };

  const onChangeSelectObjectName = (objectName) => {
    // setObjectName(objectName ? objectName : "");
    setSelectedImg((prevSelectedImg) => ({
      ...prevSelectedImg,
      [selectedImg.dataShowImg.name]: {
        ...selectedImg[selectedImg.dataShowImg.name],
        label: objectName ? objectName : "",
      },
    }));
  };

  const onChangeSelectDescribeObject = (describe) => {
    // setStatusObject(status ? status : "");
    setSelectedImg((prevSelectedImg) => ({
      ...prevSelectedImg,
      [selectedImg.dataShowImg.name]: {
        ...selectedImg[selectedImg.dataShowImg.name],
        title: describe ? describe : "",
      },
    }));
  };

  // const onChangeStatusObject = (e) => {
  //   setSelectedImg((prevSelectedImg) => ({
  //     ...prevSelectedImg,
  //     [selectedImg.dataShowImg.name]: {
  //       ...selectedImg[selectedImg.dataShowImg.name],
  //       status: e.target.value,
  //     },
  //   }));
  // };

  const handleUpdateInfoImages = () => {
    const updatedImages = imagesInfo.map((image) => {
      if (
        image.dataShowImg.name === selectedImg.dataShowImg.name &&
        image.dataShowImg.url === selectedImg.dataShowImg.url
      ) {
        return selectedImg; // Thay thế object cũ bằng object mới
      } else {
        return image; // Giữ nguyên object cũ
      }
    });

    setImagesInfo(updatedImages);
  };

  const handleSubmitImportImages = async (event) => {
    event.preventDefault(); // Prevent default form submission

    setSendClicked(true);

    const formData = new FormData();
    formData.append("schedule_id", schedule_id);
    const jsonDataArray = imagesInfo.map((item) =>
      JSON.stringify({ [item.dataShowImg.name]: item[item.dataShowImg.name] })
    );
    const jsonDataString = JSON.stringify(jsonDataArray);
    formData.append("data", jsonDataString);
    for (let i = 0; i < imagesFiles.length; i++) {
      console.log(imagesFiles[i]);
      formData.append(imagesFiles[i].name, imagesFiles[i]);
    }

    console.log(formData);

    const response = await ImportImageService.postData({
      data: formData,
      options: {
        headers: {
          "content-type": "multipart/form-data",
        },
      },
    });

    if (response === "image saved successfully.") {
      toast.success("Tất cả ảnh vừa thêm đã được lưu !", {
        onClose: () => {
          setSendClicked(false);
          setHadImportNewData(true);
          handleCloseImportDialog();
        },
      });
    } else {
      setSendClicked(false);
    }
  };

  const handlePoleIdOptions = () => {
    if (poleId.length > 0) {
      return (
        <Box sx={{ width: "100%" }}>
          <FormControl
            fullWidth
            disabled={
              selectedImg && selectedImg.dataShowImg.name ? false : true
            }
          >
            <InputLabel>Tên cột</InputLabel>
            <Select
              label="Tên cột"
              defaultValue={""}
              value={
                selectedImg &&
                selectedImg[selectedImg.dataShowImg.name].location
                  ? selectedImg[selectedImg.dataShowImg.name].location
                  : ""
              }
              onChange={(e) => {
                onChangeSelectPoleId(e);
              }}
            >
              {poleId.map((pole) => (
                <MenuItem value={pole.point}>{pole.point}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      );
    }
  };

  const handleObjectNameOptions = () => {
    return (
      <>
        {type_ticket && (
          <Autocomplete
            disabled={
              selectedImg && selectedImg[selectedImg.dataShowImg.name].location
                ? false
                : true
            }
            options={Object.keys(suggestOptions[type_ticket])}
            value={
              selectedImg && selectedImg[selectedImg.dataShowImg.name].label
                ? selectedImg[selectedImg.dataShowImg.name].label
                : ""
            }
            getOptionLabel={(option) => {
              const translatedOption = translateToVietnamese(option);
              return translatedOption;
            }}
            onChange={(event, newValue) => {
              onChangeSelectObjectName(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                value={params.value}
                label={"Tên đối tượng"}
              />
            )}
            sx={{ width: "100%", marginTop: "10px" }}
          />
        )}
      </>
    );
  };

  const handleDescribeObjectOptions = () => {
    return (
      <>
        {selectedImg &&
        type_ticket &&
        suggestOptions[type_ticket][
          selectedImg[selectedImg.dataShowImg.name].label
        ]?.defect &&
        suggestOptions[type_ticket][
          selectedImg[selectedImg.dataShowImg.name].label
        ]?.defect.length > 0 ? (
          <Autocomplete
            disabled={
              selectedImg && selectedImg[selectedImg.dataShowImg.name].label
                ? false
                : true
            }
            options={
              selectedImg && selectedImg[selectedImg.dataShowImg.name].label
                ? suggestOptions[type_ticket][
                    selectedImg[selectedImg.dataShowImg.name].label
                  ].defect
                : ""
            }
            getOptionLabel={(option) => {
              return option;
            }}
            value={
              selectedImg && selectedImg[selectedImg.dataShowImg.name].title
                ? selectedImg[selectedImg.dataShowImg.name].title
                : ""
            }
            onChange={(event, newValue) => {
              onChangeSelectDescribeObject(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                value={params.value}
                label={"Mô tả thiết bị"}
              />
            )}
            sx={{ width: "100%", marginTop: "10px" }}
          />
        ) : (
          <TextField
            disabled={
              selectedImg && selectedImg[selectedImg.dataShowImg.name].label
                ? false
                : true
            }
            value={
              selectedImg && selectedImg[selectedImg.dataShowImg.name].title
                ? selectedImg[selectedImg.dataShowImg.name].title
                : ""
            }
            onChange={(e) => onChangeSelectDescribeObject(e.target.value)}
            label={"Mô tả thiết bị"}
            sx={{ width: "100%", marginTop: "10px" }}
          />
        )}
      </>
    );
  };

  const handleImgClick = (imgInfo, index) => {
    setSelectedImg(imgInfo);
    setSelectedImgIndex(index);
  };

  const handleCloseImportDialog = () => {
    setOpenImportDataDialog(false);
    setImagesInfo([]);
    setImagesFiles([]);
    setSelectedImg(null);
  };

  return (
    <>
      <Button
        className={styles.importBtn}
        variant="contained"
        onClick={() => setOpenImportDataDialog(true)}
      >
        THÊM DỮ LIỆU
      </Button>
      <Dialog
        open={openImportDataDialog}
        fullWidth
        maxWidth={imagesInfo.length > 0 ? "xl" : "sm"}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "15px",
          },
        }}
      >
        <DialogTitle sx={{ height: "fit-content" }}>
          <Button
            className={styles.closeBtn}
            color="error"
            variant="contained"
            onClick={() => handleCloseImportDialog()}
          >
            <CloseIcon fontSize="small" />
          </Button>
        </DialogTitle>
        <DialogContent>
          {imagesInfo.length > 0 ? (
            <div className={styles.container}>
              {imagesInfo ? (
                imagesInfo.map((img, index) => (
                  <>
                    <div
                      className={styles.image}
                      key={index}
                      onClick={() => handleImgClick(img, index)}
                    >
                      <span
                        className={styles.delete}
                        onClick={() => handleDeleteImages(index)}
                      >
                        <img
                          src={DeleteIcon}
                          srcSet={DeleteIcon}
                          alt="delete"
                        />
                      </span>
                      <img
                        className={
                          (img[img.dataShowImg.name].location !== null &&
                            img[img.dataShowImg.name].label !== null &&
                            img[img.dataShowImg.name].title !== null) ||
                          selectedImgIndex === index
                            ? // img[img.dataShowImg.name].status !== null
                              "choosed"
                            : ""
                        }
                        src={img.dataShowImg.url}
                        alt={img.dataShowImg.name}
                      />

                      {/* add when click on image to edit */}
                      {selectedImgIndex === index ? (
                        <EditIcon
                          fontSize="large"
                          style={{
                            position: "absolute",
                            left: "50%",
                            top: "45%",
                          }}
                        />
                      ) : (
                        <></>
                      )}

                      {img[img.dataShowImg.name].location !== null &&
                      img[img.dataShowImg.name].label !== null &&
                      img[img.dataShowImg.name].title !== null ? (
                        <div className={styles.checkmarkHadchoosed}></div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </>
                ))
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )}

          <div className={styles.card}>
            <div
              className={styles.dragArea}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                width: imagesInfo.length > 0 ? "25.3333%" : "90%",
              }}
            >
              {isDragging ? (
                <span className={styles.select}>Thả ảnh tại đây </span>
              ) : (
                <>
                  <span className={styles.dragAreaText}>
                    <CloudUploadIcon sx={{ width: "100px", height: "100px" }} />{" "}
                    <br />
                    Kéo và thả ảnh tại đây <br />
                    -- hoặc -- <br />
                    <Button variant="contained" onClick={() => selectFiles()}>
                      Tìm kiếm trong thư mục
                    </Button>
                  </span>
                </>
              )}
              <input
                name="file"
                type="file"
                accept="image/*"
                className="file"
                multiple
                ref={fileInputRef}
                onChange={(e) => handleFileSelectOnChange(e)}
                style={{ display: "none" }}
              />
            </div>
            {imagesInfo.length > 0 && (
              <div className={styles.chooseOptionGroup}>
                {handlePoleIdOptions()}

                {handleObjectNameOptions()}

                {handleDescribeObjectOptions()}

                <Button
                  disabled={
                    selectedImg != null &&
                    selectedImg[selectedImg.dataShowImg.name].location !=
                      null &&
                    selectedImg[selectedImg.dataShowImg.name].label != null &&
                    selectedImg[selectedImg.dataShowImg.name].title != null
                      ? false
                      : true
                  }
                  onClick={() => handleUpdateInfoImages()}
                  sx={{ width: "fit-content" }}
                  variant="contained"
                >
                  Thêm thông tin vào ảnh
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <Button
            disabled={
              imagesFiles.length > 0 && imagesInfo.length > 0 ? false : true
            }
            onClick={handleSubmitImportImages}
            variant="contained"
          >
            Gửi
          </Button>
        </DialogActions>

        {sendClicked === true ? <Loading /> : <></>}
      </Dialog>
    </>
  );
};

export default FlightManageImportData;
