import React, { useEffect, useState } from "react";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "../states/apislice";
import ActionsPagesContainer from "../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../components/Actions components/AddComponent";
import { message } from "antd";
import FetchingPage from "./FetchingPage";

const Settings = () => {
  const { data, isSuccess, isloading } = useGetSettingsQuery();
  const [
    updateSettings,
    {
      isLoading: isUpdating,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateSettingsMutation();

  const [settings, setSettings] = useState({
    rmaFeeColtan: "",
    rmaFeeCassiterite: "",
    rmaFeeWolframite: "",
    nameOfCompany: "",
    representative: "",
    address: { province: "", district: "", sector: "", street: "" },
    editExpiresIn: "",
    logsLifeTime: "",
    rmaFeeLithium: "",
    rmaFeeBeryllium: "",
  });

  useEffect(() => {
    if (isUpdateSuccess) {
      return message.success("Settings updated successfully");
    } else if (isUpdateError) {
      const { message: errorMessage } = updateError.data;
      return message.error(errorMessage);
    }
  }, [isUpdateError, isUpdateSuccess, updateError]);

  useEffect(() => {
    if (isSuccess) {
      const { settings: existingSettings } = data.data;
      console.log("---------------------------")
      console.log(existingSettings);
      setSettings((prevState) => ({
        ...prevState,
        rmaFeeWolframite: existingSettings.rmaFeeWolframite,
        rmaFeeCassiterite: existingSettings.rmaFeeCassiterite,
        rmaFeeColtan: existingSettings.rmaFeeColtan,
        rmaFeeLithium: existingSettings.rmaFeeLithium,
        rmaFeeBeryllium: existingSettings.rmaFeeBeryllium,
        nameOfCompany: existingSettings.nameOfCompany,
        address: {
          province: existingSettings.address.province,
          district: existingSettings.address.district,
          sector: existingSettings.address.sector,
          street: existingSettings.address.street,
        },
        representative: existingSettings.representative,
        editExpiresIn: existingSettings.editExpiresIn,
        logsLifeTime: existingSettings.logsLifeTime,
      }));
    }
  }, [isSuccess, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("address.")) {
      const addressField = name.split(".")[1];
      setSettings((prevState) => ({
        ...prevState,
        address: {
          ...prevState.address,
          [addressField]: value,
        },
      }));
    } else {
      setSettings((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleChangeSettings = (e) => {
    setSettings((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCancel = () => {
    setSettings({
      nameOfCompany: "",
      rmaFeeWolframite: "",
      rmaFeeColtan: "",
      rmaFeeCassiterite: "",
      representative: "",
      address: { province: "", district: "", sector: "", street: "" },
      editExpiresIn: "",
      logsLifeTime: "",
      rmaFeeBeryllium: "",
      rmaFeeLithium: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = settings;
    await updateSettings({ body });
  };

  return (
    <>
      {isloading ? (
        <FetchingPage />
      ) : (
        <ActionsPagesContainer
          title={"General Settings"}
          subTitle={"Modify to preferred settings"}
          actionsContainer={
            <AddComponent
              component={
                <div className="grid grid-cols-1 gap-y-10 pb-10">
                  <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-fit list-none items-center">
                    <li>
                      <p className="mb-1">Coltan RMA Fee</p>
                      <input
                        type="number"
                        name="rmaFeeColtan"
                        value={settings.rmaFeeColtan || ""}
                        className="focus:outline-none p-2 border rounded-lg w-full"
                        onChange={handleChange}
                      />
                    </li>
                    {/* ******* */}
                    <li>
                      <p className="mb-1">Cassiterite RMA Fee</p>

                      <input
                        type="number"
                        name="rmaFeeCassiterite"
                        value={settings.rmaFeeCassiterite || ""}
                        className="focus:outline-none p-2 border rounded-lg w-full"
                        onWheelCapture={(e) => {
                          e.target.blur();
                        }}
                        onChange={handleChangeSettings}
                      />
                    </li>
                    {/* ******* */}
                    <li>
                      <p className="mb-1">Wolframite RMA Fee</p>
                      <input
                        type="number"
                        name="rmaFeeWolframite"
                        value={settings.rmaFeeWolframite || ""}
                        className="focus:outline-none p-2 border rounded-lg w-full"
                        onWheelCapture={(e) => {
                          e.target.blur();
                        }}
                        onChange={handleChange}
                      />
                    </li>
                    {/* ******* */}
                    <li>
                      <p className="mb-1">Lithium RMA Fee</p>

                      <input
                          type="number"
                          name="rmaFeeLithium"
                          value={settings.rmaFeeLithium || 0}
                          className="focus:outline-none p-2 border rounded-lg w-full"
                          onWheelCapture={(e) => {
                            e.target.blur();
                          }}
                          onChange={handleChangeSettings}
                      />
                    </li>
                    <li>
                    <p className="mb-1">Beryllium RMA Fee</p>
                    <input
                        type="number"
                        name="rmaFeeBeryllium"
                        value={settings.rmaFeeBeryllium || 0}
                        className="focus:outline-none p-2 border rounded-lg w-full"
                        onWheelCapture={(e) => {
                          e.target.blur();
                        }}
                        onChange={handleChangeSettings}
                    />
                  </li>
                    <li>
                      <p className="mb-1">Name of Processor</p>
                      <input
                        type="text"
                        name="nameOfCompany"
                        id="nameOfCompany"
                        autoComplete="off"
                        value={settings.nameOfCompany || ""}
                        className="focus:outline-none p-2 border rounded-lg w-full"
                        onChange={handleChange}
                      />
                    </li>
                    <li>
                      <p className="mb-1">Name of Representatative</p>
                      <input
                        type="text"
                        name="representative"
                        id="representative"
                        autoComplete="off"
                        value={settings.representative || ""}
                        className="focus:outline-none p-2 border rounded-lg w-full"
                        onChange={handleChange}
                      />
                    </li>
                    <li>
                      <p className="mb-1">Province</p>
                      <input
                        type="text"
                        name="address.province"
                        id="province"
                        autoComplete="off"
                        value={settings.address.province || ""}
                        className="focus:outline-none p-2 border rounded-lg w-full"
                        onChange={handleChange}
                      />
                    </li>
                    <li>
                      <p className="mb-1">District</p>
                      <input
                        type="text"
                        name="address.district"
                        id="district"
                        autoComplete="off"
                        value={settings.address.district || ""}
                        className="focus:outline-none p-2 border rounded-lg w-full"
                        onChange={handleChange}
                      />
                    </li>
                    <li>
                      <p className="mb-1">Sector</p>
                      <input
                        type="text"
                        name="address.sector"
                        id="sector"
                        autoComplete="off"
                        value={settings.address.sector || ""}
                        className="focus:outline-none p-2 border rounded-lg w-full"
                        onChange={handleChange}
                      />
                    </li>
                    <li>
                      <p className="mb-1"> Road number Street</p>
                      <input
                        type="text"
                        name="address.street"
                        id="street"
                        autoComplete="off"
                        value={settings.address.street || ""}
                        className="focus:outline-none p-2 border rounded-lg w-full"
                        onChange={handleChange}
                      />
                    </li>
                    <li>
                      <p className="mb-1">Edit Request Expires In (min)</p>
                      <input
                        type="number"
                        name="editExpiresIn"
                        id="editExpiresIn"
                        title="Enter value in minutes"
                        autoComplete="off"
                        value={settings.editExpiresIn || ""}
                        className="focus:outline-none p-2 border rounded-lg w-full"
                        onChange={handleChange}
                        onWheelCapture={(e) => {
                          e.target.blur();
                        }}
                      />
                    </li>
                    <li>
                      <p className="mb-1">Logs Life Time (days)</p>
                      <input
                        type="number"
                        name="logsLifeTime"
                        id="logsLifeTime"
                        autoComplete="off"
                        value={settings.logsLifeTime || ""}
                        className="focus:outline-none p-2 border rounded-lg w-full"
                        onChange={handleChange}
                        onWheelCapture={(e) => {
                          e.target.blur();
                        }}
                      />
                    </li>
                  </ul>
                </div>
              }
              Add={handleSubmit}
              Cancel={handleCancel}
              isloading={isUpdating}
            />
          }
        />
      )}
    </>
  );
};

export default Settings;
