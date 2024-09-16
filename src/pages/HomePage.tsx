import { CircularProgress, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { BsKanbanFill } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { MdOutlineExitToApp } from "react-icons/md";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import KanbanBoard from "src/components/KanbanBoard";
import { useGetUserTasks } from "src/api/taskApi";
import { storage } from "src/configs/firebase";
import { Task } from "src/constants/types";
import { useDebounce } from "src/hooks/useDebounce";
import { setRole, setUserId } from "src/store/authSlice";
import { decodeToken, generateId } from "src/utils/helper";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState<any>(null);
  const [anchorProfile, setAnchorProfile] = useState<null | HTMLElement>(null);
  const [searchTaskValue, setSearchTaskValue] = useState<string>("");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const openProfileMenu = Boolean(anchorProfile);

  const debouncedSearchTaskValue = useDebounce(searchTaskValue, 800);

  // Upload image
  const [image, setImage] = useState<File | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const imageListRef = ref(storage, "images/");

  useEffect(() => {
    listAll(imageListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageUrls((prev) => [...prev, url]);
        });
      });
    });
  }, []);

  // console.log('urls', imageUrls)

  // Check is token valid, if
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      const userInfo = decodeToken(storedToken);
      setUser(userInfo);
      console.log("user info", userInfo);

      // Set role and userId using Redux
      dispatch(setRole(userInfo.role));
      dispatch(setUserId(userInfo.sub));

      const currentTime = Math.floor(Date.now() / 1000);
      if (userInfo.exp && userInfo.exp < currentTime) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate, dispatch]);

  const { data, isLoading } = useGetUserTasks(user?.sub || "");

  // if (data) console.log("data in home changed", data);

  // Search task
  useEffect(() => {
    if (data && data.data.tasks) {
      if (debouncedSearchTaskValue) {
        setFilteredTasks(
          data.data.tasks.filter((task: Task) =>
            task.name
              .toLowerCase()
              .includes(debouncedSearchTaskValue.toLowerCase())
          )
        );
      } else {
        setFilteredTasks(data.data.tasks);
      }
    }
  }, [data, debouncedSearchTaskValue]);

  if (isLoading) {
    return (
      <div className="flex-center mt-[20%]">
        <CircularProgress />
      </div>
    );
  }

  const handleLogOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  // Upload image

  const uploadeImage = () => {
    if (!image) return;

    const imageRef = ref(storage, `images/${image.name + "_" + generateId()}`);
    uploadBytes(imageRef, image).then(() => {
      alert("image uploaded");
    });
  };

  return (
    <div className="overflow-x-auto min-h-[140vh] w-full bg-gradient-to-r from-[#FEC362] via-[#ECE854] to-[#5B9DFF]">
      <nav className="fixed top-0 w-full bg-gray-200 p-4 flex items-center justify-between gap-4 border-b-2 border-black z-30">
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
          <MenuItem onClick={handleLogOut} className="flex-center gap-2">
            <MdOutlineExitToApp className="text-red-500" />
            <p className="text-red-500 font-semibold">Log out</p>
          </MenuItem>
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
              value={searchTaskValue}
              onChange={(e) => setSearchTaskValue(e.target.value)}
              className="input-field pl-10"
              placeholder="Type here to search..."
            />
          </div>
        </div>

        {user ? (
          <div
            className="hover:bg-dark-1 p-1 rounded-md cursor-pointer mr-8"
            onClick={(e) => setAnchorProfile(e.currentTarget)}
          >
            <p className="font-semibold text-lg">{user.displayName}</p>
          </div>
        ) : (
          <Link to={"/login"}>
            <button className="hover:bg-dark-3 hover:text-white p-2 rounded-md">
              Login
            </button>
          </Link>
        )}
      </nav>

      {/* Test Firebase */}
      {/* <div className="mt-20 flex-center">
        <input
          type="file"
          name=""
          id=""
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0)
              setImage(e.target.files[0]);
          }}
        />
        <button className="btn-primary" onClick={uploadeImage}>
          Upload image to Firebase
        </button>
      </div> */}

      {filteredTasks && (
        <>
          {/* Private board show the private (assigned) task and public task they take */}
          <div className="h-[60vh] mt-20">
            <KanbanBoard
              isPublic={false}
              tasks={filteredTasks.filter(
                (task: Task) => task.assignedUserId === user.sub
              )}
            />
          </div>

          <div className="h-1 w-full px-8 bg-red-400"></div>

          <div className="h-[60vh]">
            <KanbanBoard
              isPublic={true}
              tasks={filteredTasks.filter((task: Task) => task.isPublic)}
              name="Public tasks"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
