import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { useDeleteTaskImage, useGetTaskImages } from "src/api/taskApi";
import { Image } from "src/constants/types";
import { getImageNameFromUrl } from "src/utils/helper";
import { showNotification } from "src/utils/notificationUtil";

const TaskImages = ({ taskId }: { taskId: string }) => {
  const { data: imageUrls, isLoading, isError } = useGetTaskImages(taskId);
  const [openDeleteImage, setOpenDeleteImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const { mutate: deleteImage } = useDeleteTaskImage();

  if (isLoading) return <div>Loading images...</div>;
  if (isError) return <div>{"Failed to fetch images."}</div>;

  const handleDeleteImage = () => {
    deleteImage(selectedImage?.id || "", {
      onSuccess: () => {
        showNotification("success", "Deleted image");
        handleClose();
      },
      onError: () => {
        showNotification("error", "Delete image failed");
      },
    });
  };

  const handleClose = () => {
    setOpenDeleteImage(false);
  };

  return (
    <div className="flex gap-2 overflow-x-auto">
      {imageUrls && imageUrls.data.images.length === 0 ? (
        <div>No images available.</div>
      ) : (
        imageUrls.data.images.map((item: Image) => (
          <div key={item.id} className="relative">
            <img
              key={item.id}
              src={item.imageUrl}
              alt={"img"}
              className="w-auto h-[150px] rounded-md"
            />
            <button
              className="absolute top-1 right-1 bg-gray-500 opacity-50 hover:opacity-100 text-white p-1 rounded"
              onClick={() => {
                setSelectedImage(item);
                setOpenDeleteImage(true);
              }}
            >
              <MdDeleteForever />
            </button>
          </div>
        ))
      )}

      <Dialog open={openDeleteImage} onClose={handleClose}>
        <DialogTitle>Confirm image deletion</DialogTitle>

        <DialogContent>
          Are you sure you want to delete image{" "}
          <p className="text-red-500">
            {getImageNameFromUrl(selectedImage?.imageUrl || "")}?
          </p>
        </DialogContent>
        <DialogActions>
          <button className="btn-primary px-3" onClick={handleDeleteImage}>
            Yes
          </button>
          <button className="btn-primary px-3 bg-red-500" onClick={handleClose}>
            No
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TaskImages;
