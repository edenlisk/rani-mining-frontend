import { useState } from "react";
import ActionsPagesContainer from "../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../components/Actions components/AddComponent";


const AddProductPage = () => {
    const [formval, setFormval] = useState({ productName: 'Hp victus',category:'Computer',subCategory:'Pc',brand:'Hp',unit:'652',sku:'4',minimumQty:'6',quantity:'22',tax:'2%',discountType:'0%',price:'859£',status:'Available' });
    const handleAddproduct = (e) => {
        setFormval({ ...formval, [e.target.name]: e.target.value })
    }
    const handleProductSubmit=()=>{
    }
    const handleCancel=()=>{
        setFormval({ productName: '',category:'',subCategory:'',brand:'',unit:'',sku:'',minimumQty:'',quantity:'',tax:'',discountType:'',price:'',status:'' })
    }
    return (
        <div>
            <ActionsPagesContainer title={'Add Product'}
                subTitle={'Create new product'}
                actionsContainer={<AddComponent component={
                    <div className="flex flex-col gap-3">
                        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 h-fit list-none">
                            <li>
                                <p className="mb-1">Product Name</p>
                                <input value={formval.productName || ''} type="text" name="productName" id="productName" className="focus:outline-none  p-2 border rounded-lg w-full"
                                    onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Category</p>
                                <input type="text" name="category" id="category" className="focus:outline-none  p-2 border rounded-lg w-full"value={formval.category || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Sub ategory</p>
                                <input type="text" name="subCategory" id="subCategory" className="focus:outline-none  p-2 border rounded-lg w-full"value={formval.subCategory|| ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Brand</p>
                                <input type="text" name="brand" id="brand" className="focus:outline-none  p-2 border rounded-lg w-full"value={formval.brand || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Unit</p>
                                <input type="text" name="unit" id="unit" className="focus:outline-none  p-2 border rounded-lg w-full"value={formval.unit || ''} onChange={handleAddproduct}  />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">SKU</p>
                                <input type="text" name="sku" id="sku" className="focus:outline-none  p-2 border rounded-lg w-full" value={formval.sku || ''} onChange={handleAddproduct}/>
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Minimum Qty</p>
                                <input type="text" name="minimumQty" id="minimumQty" className="focus:outline-none  p-2 border rounded-lg w-full" value={formval.minimumQty|| ''} onChange={handleAddproduct}/>
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Quantity</p>
                                <input type="text" name="quantity" id="quantity" className="focus:outline-none  p-2 border rounded-lg w-full" value={formval.quantity || ''} onChange={handleAddproduct}/>
                            </li>
                            {/* ******* */}


                        </ul>
                        <span>
                            <p className="mb-1">Description</p>
                            <textarea className="focus:outline-none border rounded-md w-full h-24" name="comment"></textarea>
                        </span>
                        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 h-fit list-none">
                            <li>
                                <p className="mb-1">Tax</p>
                                <input type="text" name="tax" id="tax" className="focus:outline-none  p-2 border rounded-lg w-full"value={formval.tax || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Discount Type</p>
                                <input type="text" name="discountType" id="discountType" className="focus:outline-none  p-2 border rounded-lg w-full"value={formval.discountType || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Price</p>
                                <input type="text" name="price" id="price" className="focus:outline-none  p-2 border rounded-lg w-full" value={formval.price || ''} onChange={handleAddproduct}/>
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Status</p>
                                <input type="text" name="status" id="status" className="focus:outline-none  p-2 border rounded-lg w-full" value={formval.status || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}

                        </ul>
                    </div>
                } 
                Add={handleProductSubmit}
                Cancel={handleCancel}/>} />
        </div>
    )
}
export default AddProductPage;