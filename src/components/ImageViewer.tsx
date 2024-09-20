import { Dialog, DialogContent } from "@mui/material";
import { useEffect, useState } from "react";
import { IoMdArrowForward } from "react-icons/io";
import { MdArrowBack } from "react-icons/md";
import { Image } from "src/constants/types";
import { getImageNameFromUrl } from "src/utils/helper";

type ImageViewerProps = {
  openViewer: boolean;
  imageData: Image[];
  selectedPreviewImage: Image | null;
  handleCloseViewer: () => void;
};

const ImageViewer = (props: ImageViewerProps) => {
  const { openViewer, handleCloseViewer, selectedPreviewImage, imageData } =
    props;

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // console.log("in preview", imageData);
  // console.log("selectedPreviewImage", selectedPreviewImage);

  useEffect(() => {
    if (selectedPreviewImage && imageData.length > 0) {
      const selectedIndex = imageData.findIndex(
        (img) => img.id === selectedPreviewImage.id
      );

      if (selectedIndex !== -1) {
        setCurrentIndex(selectedIndex);
      }
    }
  }, [selectedPreviewImage, imageData]);

  const handleNextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === imageData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imageData.length - 1 : prevIndex - 1
    );
  };

  // Use keyboard to next/prev image
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      handleNextImage();
    } else if (event.key === "ArrowLeft") {
      handlePrevImage();
    }
  };

  useEffect(() => {
    if (openViewer) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [openViewer]);

  return (
    <Dialog
      open={openViewer}
      onClose={handleCloseViewer}
      fullWidth={true}
      maxWidth={"md"}
    >
      <DialogContent>
        <div className="relative">
          <img
            key={imageData[currentIndex].id}
            src={imageData[currentIndex]?.imageUrl}
            alt={getImageNameFromUrl(imageData[currentIndex].imageUrl)}
            className="mx-auto"
          />
          <button
            className="btn-primary bg-gray-500 p-2 absolute opacity-50 hover:opacity-100 top-1/2"
            onClick={handlePrevImage}
            hidden={imageData.length <= 1}
          >
            <MdArrowBack />
          </button>
          <button
            className="btn-primary bg-gray-500 p-2 absolute opacity-50 hover:opacity-100 top-1/2 right-0"
            onClick={handleNextImage}
            hidden={imageData.length <= 1}
          >
            <IoMdArrowForward />
          </button>
          <p className="text-center text-md font-semibold mt-1">
            {getImageNameFromUrl(imageData[currentIndex].imageUrl)}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewer;
