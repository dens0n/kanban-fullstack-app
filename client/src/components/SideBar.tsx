import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowRight, ArrowLeft, LogOut, Plus, Trash2, X } from "lucide-react";

//Types
import { Project, Id } from "../types/types";

type Props = {
  onHandleProjectClick: (id: Id) => void;
};

export default function SideBar({ onHandleProjectClick }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<Id | null>(null);
  const [hoveredProjectId, setHoveredProjectId] = useState<Id | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
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

  const handleNewProjectSubmit = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/projects",
        { name: inputText },
        { withCredentials: true },
      );
      setInputText("");
      setIsModalOpen(false);
      fetchProjects();
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const deleteProject = async (id: Id) => {
    try {
      await axios.delete(`http://localhost:3000/api/projects/${id}`, {
        withCredentials: true,
      });
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div
      className={`flex h-screen ${
        isSidebarOpen ? "w-[250px] px-7 pb-10 pt-7" : "w-14 px-3 pb-10 pt-7"
      } flex-col justify-between bg-columnBackgroundColor transition-all duration-300 ease-in-out`}
    >
      <div className="flex flex-col gap-10">
        <div className="flex justify-end rounded-lg text-gray-300">
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
          <>
            {!isModalOpen ? (
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setIsModalOpen(!isModalOpen)}
                  className="flex cursor-pointer items-center justify-between rounded-lg border-2 border-columnBackgroundColor bg-mainBackgroundColor px-1 py-1 text-gray-300 ring-sky-500 hover:text-sky-500 hover:ring-2"
                >
                  New Project
                  <Plus />
                </button>
                {projects &&
                  projects.map((project) => (
                    <div
                      key={project._id}
                      className="flex items-center justify-between gap-2"
                      onMouseEnter={() => setHoveredProjectId(project._id)}
                      onMouseLeave={() => setHoveredProjectId(null)}
                    >
                      <button
                        key={project._id}
                        onClick={() => {
                          onHandleProjectClick(project._id);
                          setActiveProjectId(project._id);
                        }}
                        className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border-2 border-columnBackgroundColor bg-mainBackgroundColor px-2 py-1 text-gray-300 ring-sky-500 hover:text-sky-500 hover:ring-2 ${
                          activeProjectId === project._id
                            ? "text-sky-500 ring-2 ring-sky-500"
                            : ""
                        }`}
                      >
                        {project.name}
                      </button>
                      {hoveredProjectId === project._id ||
                      activeProjectId === project._id ? (
                        <button
                          onClick={() => deleteProject(project._id)}
                          className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-columnBackgroundColor bg-mainBackgroundColor px-1 py-1 text-gray-300 ring-rose-500 hover:text-rose-500 hover:ring-2"
                        >
                          <Trash2 />
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setInputText("");
                    }}
                    className="inline-flex cursor-pointer rounded-lg border-2 border-columnBackgroundColor bg-mainBackgroundColor px-0 py-0 text-gray-300 ring-rose-500 hover:text-rose-500 hover:ring-2"
                  >
                    <X />
                  </button>
                </div>
                <input
                  className="h-8 w-full rounded-lg bg-mainBackgroundColor px-2 py-1 ring-2 ring-sky-700 focus:outline-none focus:ring-sky-500"
                  type="text"
                  placeholder="Enter project name..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                {inputText.length > 0 && (
                  <button
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-columnBackgroundColor bg-mainBackgroundColor px-2 py-1 text-gray-300 ring-2 ring-sky-700 hover:text-sky-500 hover:ring-sky-500"
                    onClick={handleNewProjectSubmit}
                  >
                    Submit
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <div
        className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-columnBackgroundColor bg-mainBackgroundColor px-1 py-1 text-gray-300 ring-rose-500 hover:text-rose-500 hover:ring-2"
        onClick={signOut}
      >
        {isSidebarOpen ? "logout" : ""}
        <LogOut />
      </div>
    </div>
  );
}
