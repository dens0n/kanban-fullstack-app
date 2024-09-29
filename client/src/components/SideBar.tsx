import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowRight, ArrowLeft, LogOut } from "lucide-react";

//Types
import { Project, Id } from "../types/types";

type Props = {
  onHandleProjectClick: (id: Id) => void;
};

export default function SideBar({ onHandleProjectClick }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/projects`, {
          withCredentials: true,
        });
        const userData = response.data.data;

        setProjects(userData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const signOut = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/logout",
        {},
        { withCredentials: true },
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={`flex h-screen ${
        isSidebarOpen ? "w-[250px] px-7 pb-10 pt-7" : "w-14 px-3 pb-10 pt-7"
      } flex-col justify-between bg-columnBackgroundColor transition-all duration-300 ease-in-out`}
    >
      <div className="flex justify-end rounded-lg text-gray-400">
        {isSidebarOpen ? (
          <button
            className="rounded-lg px-1 py-1 hover:bg-mainBackgroundColor hover:text-white hover:ring-2 hover:ring-gray-400"
            onClick={() => setIsSidebarOpen(false)}
          >
            <ArrowLeft />
          </button>
        ) : (
          <button
            className="rounded-lg px-1 py-1 hover:bg-mainBackgroundColor hover:text-white hover:ring-2 hover:ring-gray-400"
            onClick={() => setIsSidebarOpen(true)}
          >
            <ArrowRight />
          </button>
        )}
      </div>
      {isSidebarOpen && (
        <div>
          {projects &&
            projects.map((project) => (
              <button
                key={project._id}
                onClick={() => onHandleProjectClick(project._id)}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-columnBackgroundColor bg-mainBackgroundColor px-1 py-1 text-gray-400 ring-sky-500 hover:text-sky-500 hover:ring-2"
              >
                {project.name}
              </button>
            ))}
        </div>
      )}
      <div
        className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-columnBackgroundColor bg-mainBackgroundColor px-1 py-1 text-gray-400 ring-rose-500 hover:text-rose-500 hover:ring-2"
        onClick={signOut}
      >
        {isSidebarOpen ? "logout" : ""}
        <LogOut />
      </div>
    </div>
  );
}
