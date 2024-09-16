import { useGetTaskImages } from "src/api/taskApi";

const TaskImages = ({ taskId }: { taskId: string }) => {
  const { data: imageUrls, isLoading, isError } = useGetTaskImages(taskId);

  if (isLoading) return <div>Loading images...</div>;
  if (isError) return <div>{"Failed to fetch images."}</div>;

  return (
    <div className="flex gap-2 overflow-x-auto">
      {imageUrls && imageUrls.data.length === 0 ? (
        <div>No images available.</div>
      ) : (
        imageUrls.data.map((url: string) => (
          <img
            key={url}
            src={url}
            alt={"img"}
            className="w-auto h-[150px] rounded-md"
          />
        ))
      )}
    </div>
  );
};

export default TaskImages;
