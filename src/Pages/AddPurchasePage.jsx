import React,{useState} from "react";
import ActionsPagesContainer from "../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../components/Actions components/AddComponent";

const AddPurchasePage=()=>{
    const [formval, setFormval] = useState({ customer: '',date:'',suppliers:'',productname:'',orderTax:'',discount:'',shipping:'',status:'',description:'' });
    const handleAddproduct = (e) => {
        setFormval({ ...formval, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
    }
    const handleProductSubmit=()=>{
    }
    const handleCancel=()=>{
        setFormval({ customer: '',date:'',suppliers:'',productname:'',orderTax:'',discount:'',shipping:'',status:'',description:'' })
    }
    return(
        <>
        <ActionsPagesContainer title={'Add Purchase'}
        subTitle={'Add your new Purchase'}
        actionsContainer={<AddComponent
        component={
            <div className="felx flex-col gap-3">
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 h-fit list-none">
                    <li>
                        <p className="mb-1">Customer</p>
                        <select value={formval.customer || ''} name="customer" id="customer" className="focus:outline-none w-full p-2 border rounded" onChange={handleAddproduct}>
                            <option value="andre">andre</option>
                            <option value="Choose customer">Choose customer</option>
                        </select>
                    </li>
                    <li>
                        <p className="mb-1">Date</p>
                        <input value={formval.date || ''} type="text" id="date" name="date" className="focus:outline-none w-full p-2 border rounded" onChange={handleAddproduct}/>
                    </li>
                    <li>
                        <p className="mb-1">Suppliers</p>
                        <select value={formval.suppliers || ''} name="suppliers" id="suppliers" className="focus:outline-none w-full p-2 border rounded" onChange={handleAddproduct}>
                            <option value="klm">klm</option>
                            <option value="Choose customer">Choose customer</option>
                        </select>
                    </li>
                </ul>
                <span>
                    <p className="mb-1">Product name</p>
                    <input value={formval.productname || ''} type="text" id="productname" name="productname" className="focus:outline-none w-full border p-2 rounded" onChange={handleAddproduct} />
                </span>
                <div>
                    sales-list
                </div>
                <div>
                    amount-totals
                </div>
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 h-fit list-none">
                <li>
                        <p className="mb-1">order Tax</p>
                        <input value={formval.orderTax || ''} type="text" id="orderTax" name="orderTax" className="focus:outline-none w-full p-2 border rounded" onChange={handleAddproduct}/>
                    </li>
                    <li>
                        <p className="mb-1">Discount</p>
                        <input value={formval.discount || ''} type="text" id="discount" name="discount" className="focus:outline-none w-full p-2 border rounded" onChange={handleAddproduct}/>
                    </li>
                    <li>
                        <p className="mb-1">shipping</p>
                        <input value={formval.shipping || ''} type="text" id="shipping" name="shipping" className="focus:outline-none w-full p-2 border rounded" onChange={handleAddproduct}/>
                    </li>
                    <li>
                        <p className="mb-1">Status</p>
                        <select value={formval.status || ''} name="status" id="status" className="focus:outline-none w-full p-2 border rounded" onChange={handleAddproduct}>
                            <option value="klm">klm</option>
                            <option value="Choose customer">Choose customer</option>
                        </select>
                    </li>
                </ul>
                <span>
                    <p className="mb-1">Description</p>
                    <textarea value={formval.description || ''} className="focus:outline-none w-full p-3 h-24 border rounded" name="description" id="description" onChange={handleAddproduct}>

                    </textarea>
                </span>
              

            </div>
        }
        Add={handleProductSubmit}
        Cancel={handleCancel}/>}/>
        </>
    )
}
export default AddPurchasePage;