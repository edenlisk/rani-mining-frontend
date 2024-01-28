import { ImSpinner2 } from "react-icons/im";

const AddComponent = ({ Add, Cancel, component, isloading,isvalid }) => {
  return (
    <form onSubmit={Add} className="flex flex-col p-3 h-fit gap-2">
      <>{component}</>
      <div className=" self-end flex gap-2 flex-col sm:flex-row w-full justify-start md:items-center sm:gap-4 items-start action-buttons">
        {isloading ? (
          <button
            className="flex gap-2 items-center justify-start py-[10px] px-[20px] shadow-md shadow-[#A6A6A6] bg-custom_blue-200 rounded-md text-custom_blue-700 cursor-not-allowed"
            type="button"
          >
            <ImSpinner2 className="h-[19px] w-[19px] animate-spin text-custom_blue-700" />
            Sending
          </button>
        ) : (
          <button className={`${isvalid? 'bg-custom_blue-200 text-custom_blue-700 cursor-not-allowed':' bg-custom_blue-500 hover:bg-custom_blue-600 text-white'} py-[10px] px-[20px] shadow-md shadow-[#A6A6A6] rounded-md`} type="submit" disabled={isvalid}>
            Submit
          </button>
        )}
        <button
          className=" py-[10px] px-[20px] shadow-md shadow-[#A6A6A6] bg-punch-500 hover:bg-punch-700 text-white rounded-md"
          onClick={Cancel}
          type="button"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
export default AddComponent;
