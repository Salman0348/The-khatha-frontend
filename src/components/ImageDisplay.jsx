import React, { useState } from "react";
import styles from "../css-modules/ImageDisplay.module.css";
import { MdDelete } from "react-icons/md";

const ImageDisplay = ({
  imgLableMssg,
  setImageFile,
  showCrtPopUp,
  cloudinaryImgUrl,
  setCloudinaryImgUrl,
  setIsImgRemoved,
  icon: Icon,
}) => {
  const [localImageSrc, setLocalImageSrc] = useState(null); // For displaying the selected image
  const [validationMessage, setValidationMessage] = useState(""); // For validation messages
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const validFormats = ["image/jpeg", "image/png", "image/jpg"];

    // Clear previous validation message
    setValidationMessage("");

    // Validate file type
    if (file && !validFormats.includes(file.type)) {
      setValidationMessage("Only JPEG, JPG and PNG formats are accepted.");
      return;
    }

    // Validate file size (2MB limit)
    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB in bytes
    if (file && file.size > maxSizeInBytes) {
      setValidationMessage("Image size must be less than 2MB.");
      return;
    }

    // If valid, set the image source
    if (file) {
      setImageFile(file); //seting the image to image file in CreateGroupModal for upload
      if (setIsImgRemoved) {
        setIsImgRemoved(false);
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleRemoveImg = (e) => {
    setValidationMessage("");
    e.stopPropagation();
    setImageFile(null);
    setLocalImageSrc(null);
    if (setIsImgRemoved && cloudinaryImgUrl && setCloudinaryImgUrl) {
      setIsImgRemoved(true);
      setCloudinaryImgUrl("");
    }
  };

  return (
    <div className={styles.outerWrapper}>
      <div className={styles.innerWrapper}>
        <div
          className={styles.imgClickingDiv}
          onClick={() => document.getElementById("fileInput").click()}
        >
          {localImageSrc || cloudinaryImgUrl ? (
            <>
              <img
                src={localImageSrc || cloudinaryImgUrl}
                alt="User"
                className={styles.img}
              />
              <p
                className={styles.removeImgBtn}
                title="remove image"
                onClick={(e) => {
                  handleRemoveImg(e);
                }}
              >
                <MdDelete className={styles.imgRemoveIcon} />
              </p>
            </>
          ) : (
            <Icon className={styles.icon} />
          )}
        </div>

        <input
          id="fileInput"
          type="file"
          accept="image/*"
          className={styles.fileInput}
          onChange={handleImageChange}
          disabled={showCrtPopUp || false ? true : false} //default false=>:disabled false for edit profile comp
        />
        <p className={styles.imgLabel}>
          {localImageSrc || cloudinaryImgUrl
            ? "Click on image to replace"
            : `Click to add ${imgLableMssg} photo`}
        </p>

        {validationMessage && (
          <p className={styles.validationMessageP}>{validationMessage}</p>
        )}
      </div>
    </div>
  );
};

export default ImageDisplay;
