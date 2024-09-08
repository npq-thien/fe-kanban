import { CircularProgress, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { BsKanbanFill } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useGetAllTasks } from "src/api/taskApi";
import KanbanBoard from "src/components/KanbanBoard";
import { Task } from "src/constants/types";
import { setRole } from "src/store/authSlice";
import { decodeToken } from "src/utils/helper";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState<any>(null);
  const [anchorProfile, setAnchorProfile] = useState<null | HTMLElement>(null);
  const openProfileMenu = Boolean(anchorProfile);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      const userInfo = decodeToken(storedToken);
      setUser(userInfo);

      // set role using redux
      dispatch(setRole(userInfo.role));

      const currentTime = Math.floor(Date.now() / 1000);
      if (userInfo.exp && userInfo.exp < currentTime) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate, dispatch]);

  const { data, isLoading } = useGetAllTasks();
  // if (data) console.log("data in home changed", data.data.tasks);

  if (isLoading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  const handleLogOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="overflow-x-auto min-h-[200vh] w-full bg-gradient-to-r from-[#FEC362] via-[#ECE854] to-[#5B9DFF]">
      <nav className="fixed top-0 w-full bg-gray-200 p-4 flex items-center justify-between gap-4 border-b-2 border-black z-10">
        <Menu
          open={openProfileMenu}
          anchorEl={anchorProfile}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          onClose={() => setAnchorProfile(null)}
          disableScrollLock={true}
        >
          <MenuItem onClick={handleLogOut}>Log out</MenuItem>
        </Menu>

        <div className="flex gap-4 items-center">
          <Link to={"/"}>
            <div className="flex items-center p-1 gap-2 rounded-md hover:text-blue-600 animation-color">
              <BsKanbanFill />
              <p className="h3-bold">Kanban</p>
            </div>
          </Link>
          <div className="relative flex items-center">
            <FaSearch className="w-5 h-5 absolute left-2" />
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Type here to search..."
            />
          </div>
        </div>

        {user ? (
          <div
            className="hover:bg-dark-1 p-1 rounded-md cursor-pointer"
            onClick={(e) => setAnchorProfile(e.currentTarget)}
          >
            {user.displayName}
          </div>
        ) : (
          <Link to={"/login"}>
            <button className="hover:bg-dark-3 hover:text-white p-2 rounded-md">
              Login
            </button>
          </Link>
        )}
      </nav>

      {data && (
        <>
          <div className="h-[100vh] mt-20">
            <KanbanBoard isPublic={false} tasks={data.data.tasks} />
          </div>

          <div className="h-1 w-full px-8 bg-red-400"></div>

          <div className="h-[100vh]">
            <KanbanBoard
              isPublic={true}
              tasks={data.data.tasks.filter((task: Task) => task.isPublic)}
              name="Public tasks"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
