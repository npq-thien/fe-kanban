import { FaUserCircle } from "react-icons/fa";

import { TaskActivity } from "../constants/types";
import { formatDate } from "../utils/helper";

type TaskActivityProps = {
  taskActivity: TaskActivity;
};

const TaskActivityItem = (props: TaskActivityProps) => {
  const { taskActivity } = props;

  return (
    <div>
      {/* Content */}
      <div className="w-full">
        <div className="flex items-center gap-4 mb-1">
          <FaUserCircle className="w-6 h-6 text-green-500" />
          <p className="font-semibold">{taskActivity.user}</p>
          <p className="text-dark-3 text-tiny">
            {formatDate(taskActivity.date)}
          </p>
        </div>

        <div
          dangerouslySetInnerHTML={{ __html: taskActivity.content }}
          className="formatted-css w-full shadow-sm bg-white p-2 rounded-lg"
        >
          {/* {taskActivity.content} */}
        </div>
      </div>
    </div>
  );
};

export default TaskActivityItem;
