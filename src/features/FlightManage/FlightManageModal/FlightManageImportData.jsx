import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
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

import styles from "./css/FlightManageImportData.module.css";

import EditIcon from "@mui/icons-material/Edit";

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
  // 👇 files is not an array, but it's iterable, spread to get an array of files
  // const files = imagesFiles ? [...imagesFiles] : [];
  // console.log(files);
  const [imagesInfo, setImagesInfo] = useState([]);
  // console.log(imagesInfo);

  const [selectedImg, setSelectedImg] = useState(null); //TODO
  // console.log(selectedImg);
  const [selectedImgIndex, setSelectedImgIndex] = useState(null);

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // check variable change
  const [hasDeleteImg, setHasDeleteImg] = useState(false);
  const [sendClicked, setSendClicked] = useState(false);

  useEffect(() => {
    setSendClicked(false);

    const poleLocations =
      process.env.REACT_APP_API_URL +
      `${
        powerline_id
          ? `powerlinelocation/?powerline_id=${powerline_id}`
          : "powerlinelocation/"
      }`;

    axios
      .get(poleLocations)
      .then((res) => {
        console.log("data:", res.data);
        setPoleId(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
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
    return translations[englishTerm] || englishTerm; // Fallback to original term if not found
  };

  const selectFiles = () => {
    fileInputRef.current.click();
  };

  const handleFileSelectOnChange = async (e) => {
    const files = e.target.files;
    setImagesFiles([...imagesFiles, ...e.target.files]);

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
    // setSelectedImg({});
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

    setImagesFiles([...imagesFiles, ...event.dataTransfer.files]);

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

  const handleSubmitImages = async (event) => {
    event.preventDefault(); // Prevent default form submission

    setSendClicked(true);

    const formData = new FormData();
    formData.append("schedule_id", schedule_id);

    // imagesInfo.map((item) => {
    //   // Destructuring
    //   const { label, title, location, status } = item[item.dataShowImg.name];

    //   // Create an object for each item's data
    //   const imageData = {
    //     [item.dataShowImg.name]: {
    //       label,
    //       title,
    //       location,
    //       status,
    //     },
    //   };

    //   // Append data with a temporary key (optional)
    //   // formData.append("tempKey", JSON.stringify(imageData));

    //   // **OR** Append data directly to the FormData object (recommended)
    //   return formData.append("data", JSON.stringify(imageData));
    // });

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

    const urlPostImagesAndImagesInfo =
      process.env.REACT_APP_API_URL + "importimage/";

    axios
      .post(urlPostImagesAndImagesInfo, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data === "image saved successfully.") {
          alert("Tất cả ảnh vừa thêm đã được lưu !");
          setSendClicked(false);
          setHadImportNewData(true);
          handleCloseImportDialog();
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Thêm dữ liệu không thành công. Hãy điền đầy đủ thông tin ảnh !");
        setSendClicked(false);
      });
  };

  const handlePoleIdOptions = () => {
    // if (poleId) {
    //   return (
    //     <Autocomplete
    //       disabled={selectedImg && selectedImg.dataShowImg.name ? false : true}
    //       options={poleId.map((pole) => ({ label: pole.location_name, value: pole.location_id }))}
    //       value={
    //         selectedImg && selectedImg[selectedImg.dataShowImg.name].location
    //           ? selectedImg[selectedImg.dataShowImg.name].location
    //           : ""
    //       }
    //       getOptionLabel={(option) => option.label}
    //       onChange={(event, newValue) => {
    //         onChangeSelectPoleId(newValue);
    //       }}
    //       renderInput={(params) => (
    //         <TextField {...params} value={params.value} label={"Tên cột"} />
    //       )}
    //       sx={{ width: "100%", marginTop: "10px" }}
    //     />
    //   );
    // } else {
    //   return <></>;
    // }

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
              // value={superviseType}
              label="Tên cột"
              // onChange={onChangeSelectSuperviseType}
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
                <MenuItem value={pole.location_id}>
                  {pole.location_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      );
    }
  };

  const handleObjectNameOptions = () => {
    if (type_ticket && type_ticket === "D") {
      return (
        <>
          <Autocomplete
            disabled={
              selectedImg && selectedImg[selectedImg.dataShowImg.name].location
                ? false
                : true
            }
            options={Object.keys(suggestOptions.D)}
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
        </>
      );
    } else if (type_ticket && type_ticket === "N") {
      return (
        <>
          <Autocomplete
            disabled={
              selectedImg && selectedImg[selectedImg.dataShowImg.name].location
                ? false
                : true
            }
            options={Object.keys(suggestOptions.N)}
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
        </>
      );
    }
  };

  const handleDescribeObjectOptions = () => {
    if (type_ticket && type_ticket === "D") {
      return (
        <>
          <Autocomplete
            disabled={
              selectedImg && selectedImg[selectedImg.dataShowImg.name].label
                ? false
                : true
            }
            options={
              selectedImg && selectedImg[selectedImg.dataShowImg.name].label
                ? suggestOptions.D[
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
        </>
      );
    } else if (type_ticket && type_ticket === "N") {
      return (
        <>
          <Autocomplete
            disabled={
              selectedImg && selectedImg[selectedImg.dataShowImg.name].label
                ? false
                : true
            }
            options={
              selectedImg && selectedImg[selectedImg.dataShowImg.name].label
                ? suggestOptions.N[
                    selectedImg[selectedImg.dataShowImg.name].label
                  ].defect
                : ""
            }
            value={
              selectedImg && selectedImg[selectedImg.dataShowImg.name].title
                ? selectedImg[selectedImg.dataShowImg.name].title
                : ""
            }
            getOptionLabel={(option) => {
              return option;
            }}
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
        </>
      );
    }
  };

  // const handleStatusObjectOptions = () => {
  //   return (
  //     <>
  //       <FormControl fullWidth sx={{ marginTop: "10px" }}>
  //         <InputLabel>Tình trạng thiết bị</InputLabel>
  //         <Select
  //           defaultValue={objectName}
  //           label="Tình trạng thiết bị"
  //           onChange={(e) => onChangeStatusObject(e)}
  //         >
  //           <MenuItem value={"normal"}>Không có lỗi</MenuItem>
  //           <MenuItem value={"defect"}>Có lỗi</MenuItem>
  //         </Select>
  //       </FormControl>
  //     </>
  //   );
  // };

  const handleImgClick = (imgInfo, index) => {
    // console.log(imgInfo);
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
      <Dialog open={openImportDataDialog} fullWidth maxWidth="xl">
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
                        &times;
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
                        // img[img.dataShowImg.name].status !== null
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
            >
              {isDragging ? (
                <span className={styles.select}>Thả ảnh tại đây </span>
              ) : (
                <>
                  <span className={styles.dragAreaText}>
                    Kéo và thả ảnh tại đây <br />
                    -- hoặc -- <br />
                    <span
                      className={styles.select}
                      role="button"
                      onClick={() => selectFiles()}
                    >
                      Tìm kiếm trong thư mục
                    </span>
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
            <div className={styles.chooseOptionGroup}>
              {handlePoleIdOptions()}

              {handleObjectNameOptions()}

              {handleDescribeObjectOptions()}

              {/* {handleStatusObjectOptions()} */}

              {/* {checkInfoImgChange()} */}
              <Button
                disabled={
                  selectedImg != null &&
                  selectedImg[selectedImg.dataShowImg.name].location != null &&
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
          </div>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            borderTop: "1px solid black",
          }}
        >
          <Button
            disabled={
              imagesFiles.length > 0 && imagesInfo.length > 0 ? false : true
            }
            onClick={handleSubmitImages}
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
