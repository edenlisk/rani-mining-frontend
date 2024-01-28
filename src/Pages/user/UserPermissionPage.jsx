import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ActionsPagesContainer from "../../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../../components/Actions components/AddComponent";
import {
  useGetOneUserQuery,
  useUpdateUserMutation,
} from "../../states/apislice";
import { BiEditAlt } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import FetchingPage from "../FetchingPage";
import { message } from "antd";
import { toInitialCase } from "../../components/helperFunctions";

const UserPermissionPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  // const store = useSelector((state) => {
  // });
  const [isEdit, setIsEdit] = useState(false);
  const [userData, setUserData] = useState({ name: "", role: "", active: null });
  const [permissions, setPermissions] = useState({});

  const { data, isLoading, isSuccess, isError, error } = useGetOneUserQuery(
    userId,
    {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );
  const [
    updateUser,
    {
      isLoading: isSending,
      isSuccess: isDone,
      isError: isProblem,
      error: problem,
    },
  ] = useUpdateUserMutation();

  useEffect(() => {
    if (isDone) {
      message.success("User updated successfully");
      return navigate("/users");
    } else if (isProblem) {
      const { message: errorMessage } = problem.data;
      return message.error(errorMessage);
    }
  }, [isDone, isProblem, problem]);

  useEffect(() => {
    if (isSuccess) {
      const { user } = data.data;
      const { permissions } = data.data.user;
      setUserData(prevState => ({...prevState, name: user.name, role: user.role, active: user.active}));
      setPermissions(permissions);
    }
  }, [isSuccess, data]);

  const handlePermissionChange = (category, action) => {
    setPermissions((prevPermissions) => {
      const updatedPermissions = { ...prevPermissions };
      updatedPermissions[category] = { ...updatedPermissions[category] };
      updatedPermissions[category][action] =
        !updatedPermissions[category][action];
      return updatedPermissions;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { permissions, ...userData };
    await updateUser({ body, userId });
    setIsEdit(false);
    navigate(-1);
  };
  const handleCancel = () => {
    setUserData({});
    navigate(-1);
  };

  const handleChange = (e) => {
    if (e.target.type === "checkbox") {
      setUserData((prevdata) => ({
        ...prevdata,
        active: !prevdata.active,
      }));
    } else {
      setUserData((prevdata) => ({
        ...prevdata,
        [e.target.name]: e.target.value,
      }));
    }
  };

  return (
    <>
      {isLoading ? (
        <FetchingPage />
      ) : (
        <ActionsPagesContainer
          title={"Edit user permisions"}
          subTitle={"Add new coltan entry"}
          actionsContainer={
            <AddComponent
              component={
                <div className=" w-full grid grid-cols-1 gap-4">
                  <div className="w-full grid gap-2 items-center grid-cols-1 sm:grid-cols-6">
                    <div className="text center sm:col-span-1">
                      <img
                        src=""
                        alt=""
                        className=" text-3xl bg-origin-border rounded-full h-24 w-24 bg-center bg-no-repeat bg-cover bg-[url('https://img.freepik.com/free-vector/landscape-coal-mining-scene-with-crane-trucks_1308-55217.jpg?w=2000')]"
                      />
                    </div>
                    <div className=" grid grid-cols-1 gap-1 items-end justify-start sm:col-span-5">
                      {isEdit ? (
                        <div className=" space-y-2 col-span-full flex flex-col">
                          <label htmlFor="name" className=" font-semibold pl-2">
                            Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={userData.name || ""}
                            autoComplete="off"
                            className=" p-2 border w-fit rounded-md focus:outline-none"
                            onChange={handleChange}
                          />
                          <label htmlFor="role" className=" font-semibold pl-2">
                            Role
                          </label>
                          <select
                            value={userData.role || ""}
                            required
                            name="role"
                            id="role"
                            className="focus:outline-none p-2 border rounded-md w-fit"
                            onChange={handleChange}
                          >
                            <option value="ceo">CEO</option>
                            <option value="managingDirector">
                              Managing director office
                            </option>
                            <option value="operationsManager">
                              Operations manager office
                            </option>
                            <option value="accountant">
                              Accountancy office
                            </option>
                            <option value="traceabilityOfficer">
                              Traceability office
                            </option>
                            <option value="laboratoryOfficer">Laboratory Officer</option>
                            <option value="storekeeper">Storekeeper</option>
                          </select>
                          <label
                            htmlFor={`check${userData._id}`}
                            className={`bg-gray-100 px-1 py-1 rounded-full flex flex-col justify-center w-12 ${
                              userData.active === true
                                ? "items-end"
                                : "items-start"
                            }`}
                          >
                            <input
                              type="checkbox"
                              name=""
                              id={`check${userData._id}`}
                              className=" sr-only peer"
                              onChange={handleChange}
                            />
                           
                            <motion.div
                              className={`rounded-full p-[7.8px]  ${
                                userData.active === true
                                  ? "bg-orange-400"
                                  : " bg-slate-400"
                              }`}
                            ></motion.div>
                          </label>
                        </div>
                      ) : (
                        <span className="items-center">
                          <p className="text-xl font-semibold ">
                            {userData.name}
                          </p>
                          <p className="text-md">{userData.role}</p>
                          <p className="">
                            {userData.active ? "Active" : "Suspended"}
                          </p>
                        </span>
                      )}
                      <span
                      className=" justify-self-end text-black text-2xl"
                      onClick={() => {
                        setIsEdit(!isEdit);
                      }}
                    >
                      <BiEditAlt />
                    </span>
                    </div>
                  </div>

                  <div>
                    {Object.keys(permissions).map((category, index) => (
                      <div
                        key={category}
                        className="w-full grid grid-cols-1 lg:grid-cols-12 items-center"
                      >
                        <div
                          className={` col-span-1 lg:col-span-4 sm:border-0 lg:border-b-0 p-2 lg:border lg:border-r-0 bg-slate-300 ${
                            index === Object.keys(permissions).length - 1
                              ? "lg:border-b"
                              : "lg:border-b-0"
                          }`}
                        >
                          <p className=" font-semibold b md:text-base md:font-normal">
                            {toInitialCase(category)}
                          </p>
                        </div>
                        <ul
                          className={`col-span-1 lg:col-span-8 sm:flex sm:justify-between sm:items-center py-2 px-6 md:border-0 lg:border ${
                            index === Object.keys(permissions).length - 1
                              ? "lg:border-b"
                              : "lg:border-b-0"
                          }`}
                        >
                          {Object.keys(permissions[category]).map((action) => (
                            <li
                              key={action}
                              className="flex items-center gap-2 justify-start "
                            >
                              <input
                                type="checkbox"
                                id={`${category}-${action}`}
                                name={`${category}-${action}`}
                                value={`${category}-${action}`}
                                className=""
                                checked={permissions[category][action]}
                                onChange={() =>
                                  handlePermissionChange(category, action)
                                }
                              />
                              <label htmlFor={`${category}-${action}`}>
                                {action}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              }
              Add={handleSubmit}
              Cancel={handleCancel}
              isloading={isSending}
            />
          }
        />
      )}
    </>
  );
};
export default UserPermissionPage;
