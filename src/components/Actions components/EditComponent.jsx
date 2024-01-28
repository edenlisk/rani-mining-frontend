import ActionsPagesContainer from "./ActionsComponent container";


const EditComponent = ({Edit,Cancel,component}) => {
    return (
        <div className="flex flex-col p-3 h-fit gap-2">
            <form action="m-0 p-0" onSubmit={onsubmit}>
                <div className=" ">{component}</div>
                <div className=" self-end block sm:flex w-full justify-start sm:gap-2 items-center action-buttons">
                    <button className="px-6 py-2 bg-amber-100 rounded-md" onClick={Edit}>Edit</button>
                    <button className="px-6 py-2 bg-blue-100 rounded-md" onClick={Cancel}>cancel</button>
                </div>
            </form>
        </div>

    )
}
export default EditComponent;