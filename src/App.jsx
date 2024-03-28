import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import AddProductPage from './Pages/AddProductPage';
import SalesListPage from './Pages/SalesListPage';
import PurchasesListPage from './Pages/PurchasesListPage';
import UsersListPage from './Pages/user/UsersListPage';
import SuppliersListPage from './Pages/SuppliersListPage';
import AddSalesPage from './Pages/AddSalesPage';
import AddPurchasePage from './Pages/AddPurchasePage';
import AddUserPage from './Pages/user/AddUserPage';
import AddSuplierPage from './Pages/AddSuplierPage';
import RegisterPage from './Authentications/RegisterPage';
import LoginPage from './Authentications/LoginPage';
import ResetPasswordPage from './Authentications/ResetPassword';
import ForgotPasswordPage from './Authentications/ForgotPassword';
import Framer from './Framer';
import RoleBasedRoute from './routes authentication/RoleBasedRoute';
import DefaultPages from './Pages/DefaultPages';
import EditUserPage from './Pages/EditUserPage';
import TransactionEntry from './Pages/TransactionEntry';
import TrecabilityData from './Pages/TrecabilityData';
import LoginDatacontextProvider from './context files/LoginDatacontextProvider';
import ContractsistPage from './Pages/ContractListPage';
import BuyersListPage from './Pages/BuyersListPage';
import AddBuyerPage from './Pages/AddBuyerPage';
import PaymentsListPage from './Pages/PaymentsListPage';
import AddPaymentPage from './Pages/AddPaymentPage';
import EditBuyerPage from './Pages/EditBuyerPage';
import BuyerDetailsPage from './Pages/BuyerDetails';
import EditPaymentPage from './Pages/EditPaymentPage';
import EditSuplierPage from './Pages/EditSupplierPage';
import SupplierDetailsPage from './Pages/SupplierDetailsPage';
import EditMinesitePage from './Pages/EditMinesitePage';
import ColtanEntryForm from './Pages/coltan/entry/ColtanEntryForm';
import CassiteriteEntryForm from './Pages/cassiterite/entry/CassiteriteEntryForm';
import WolframiteEntryForm from './Pages/wolframite/entry/WolframiteEntryForm';
import LithiumEntryForm from './Pages/lithium/entry/LithiumEntryForm';
import BerylliumEntryForm from './Pages/beryllium/entry/BerylliumEntryForm';
import MixedEntryForm from './Pages/mixed/entry/MixedEntryForm';
import ColtanListPage from './Pages/coltan/ColtanList';
import ColtanEditForm from './Pages/coltan/entry/ColtanEditForm';
import ColtanEntryCompletePage from './Pages/coltan/entry/ColtanEntryComplete';
import PaymentsPage from './Pages/coltan/payment/PaymentsPage';
import Layout from './Layout/Layout';
import StockPage from './Pages/shipment/StockPage';
import ShipmentPage from './Pages/shipment/ShipmentPage';
import ShipmentCompletionPage from './Pages/shipment/ShipmentCompletionPage';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import ReportPage from './Pages/ReportPage';
import FetchingPage from './Pages/FetchingPage';
import LithiumListPage from './Pages/lithium/LithiumList';
import WolframiteListPage from './Pages/wolframite/WolframiteList';
import CassiteriteListPage from './Pages/cassiterite/CassiteriteList';
import BerylliumListPage from './Pages/beryllium/BerylliumList';
import CassiteriteEditForm from './Pages/cassiterite/entry/CassiteriteEditForm';
import WolframiteEditForm from './Pages/wolframite/entry/WolframiteEditForm';
import Settings from "./Pages/Settings";
import UserPermissionPage from './Pages/user/UserPermissionPage';
import CassiteriteEntryCompletePage from './Pages/cassiterite/entry/CassiteriteEntryComplete';
import WolframiteEntryCompletePage from './Pages/wolframite/entry/WolframiteEntryCompletePage';
import BerylliumEntryCompletePage from './Pages/beryllium/entry/BerylliumEntryCompletePage';
import LithiumEntryCompletePage from './Pages/lithium/entry/LithiumEntryCompletePage';
import AddContract from './Pages/AddContract';
import LithiumEditForm from './Pages/lithium/entry/LithiumEditForm';
import FileStructure from "./FileStructure/FileStructure";
import AddInvoice from "./Pages/InvoicePages/AddInvoice";
import InvoiceList from "./Pages/InvoicePages/InvoiceList";
import EditRequests from "./Pages/EditRequests";
import SingleImageUpload from "./Pages/Simbo";
import Chat from "./Pages/Chat/Chat";
import ColtanEditRequestPage from './Pages/EditRequestspages/ColtanEditRequestPage';
import AssetsList from "./RaniAssets/AssetsList";
// import InvoiceTemp from './test elements/InvoiceTemp';
// import SuppliersInvoice from './Pages/InvoicePages/SuppliersInvoice';
import AdvancedPaymentsList from './Pages/AdvancedPayments/AdvancedPaymentsList';
import AdvancedPaymentEntry from './Pages/AdvancedPayments/AdvancedPaymentEntry';
import {socket, SocketContext} from "./context files/socket";
import UsersActivityLogs from "./Pages/UsersActivityLogs";
import TagsList from "./Pages/shipment/TagsList";
import ShipmentEdit from './Pages/shipment/ShipmentEdit';
import NewUSerChart from './Pages/Chat/NewUserChat';
import BerylliumEditForm from './Pages/beryllium/entry/BerylliumEditForm';
import DashboardPage from './Pages/dashboards/DashboardHomePage';
import PrepareDDReport from "./Pages/PrepareDDReport";
import EditExistingFile from "./Pages/EditExistingFile";
import DocumentEditorComponent from "./Pages/DocumentEditor";
import GenerateLabReport from "./Pages/GenerateLabReport";
import GenerateForwardNote from "./Pages/GenerateForwardNote";
import PDFViewer from "./Pages/PDFViewer";
import ListTags from "./Pages/ListTags";
import AddTag from './Pages/AddTag';
import EditAdvancePayment from "./Pages/AdvancedPayments/EditAdvancePayment";
import RequireAuth from "./Authentications/requireAuth";
import React from "react";
import NewDocumentEditorComponent from './Pages/NewDocumentEditorComponent';
import SupplierLogin from './Pages/SupplierLogin';
import SuppliersDueDiligence from "./Pages/SuppliersDueDiligence";
import StyleTestPage from './test elements/DummyPage';
import UnauthorizedPage from './Pages/UnauthorizedPage';
import ParentComponent from './test elements/ParentComponentTest';
import ColtanEntryDynamicForm from './Pages/coltan/entry/ColtanEnteryDynamicForm';
import MineralRawEntry from './Pages/coltan/entry/MineralRawEntry';
import MineralEntryEdit from './Pages/coltan/entry/MineralEntryEdit';
import Expenses from "./Pages/Expenses/Expenses";
import AddExpense from "./Pages/Expenses/addExpense";
import Beneficiaries from "./Pages/Beneficiaries/Beneficiaries";
import AddAsset from "./RaniAssets/AddAsset";

function App() {


    return (
        <>
            <BrowserRouter>
                <ToastContainer
                    pauseOnHover
                    autoClose={3000}
                />
                <SocketContext.Provider value={socket}>
                    <Routes>
                        <Route element={<LoginDatacontextProvider/>}>
                            <Route exact path="/" element={<Navigate to="/login"/>}/>
                            <Route path='/login' element={<LoginPage/>}/>
                            <Route path="/login/supplier" element={<SupplierLogin/>}/>
                            <Route path="/suppliers/due-diligence" element={<SuppliersDueDiligence/>}/>
                            <Route element={<Layout/>}>
                                <Route element={<RequireAuth/>}>
                                    <Route path='/payment/:model/:entryId/:lotNumber?' element={<PaymentsPage/>}/>
                                    <Route path='/advanced-payment' element={<AdvancedPaymentsList/>}/>
                                    <Route path='/payment/advanced/entry' element={<AdvancedPaymentEntry/>}/>
                                    <Route path='/shipment/add/:model' element={<StockPage/>}/>
                                    <Route path='/shipments' element={<ShipmentPage/>}/>
                                    <Route path='/shipment/edit/:model/:shipmentId' element={<ShipmentEdit/>}/>
                                    <Route path='/shipment/complete/:shipmentId' element={<ShipmentCompletionPage/>}/>
                                    <Route path="/shipment/tags/:shipmentId" element={<TagsList/>} />
                                    <Route path='/report/dummy' element={<ReportPage/>}/>

                                    <Route path='/coltan' element={<ColtanListPage/>}/>
                                    <Route path='/cassiterite' element={<CassiteriteListPage/>}/>
                                    <Route path='/wolframite' element={<WolframiteListPage/>}/>
                                    <Route path='/lithium' element={<LithiumListPage/>}/>
                                    <Route path='/beryllium' element={<BerylliumListPage/>}/>
                                    <Route path='/mixed' element={<MixedEntryForm/>}/>

                                    {/* <Route path='/entry/add/coltan' element={<ColtanEntryForm/>}/> */}
                                    {/* <Route path='/entry/add/coltan' element={<RoleBasedRoute element={<ColtanEntryForm />} permissionKey="shipments"/>}/>
                                    <Route path='/entry/add/coltan/test' element={<ColtanEntryDynamicForm/>}/>
                                    <Route path='/entry/add/cassiterite' element={<CassiteriteEntryForm/>}/>
                                    <Route path='/entry/add/wolframite' element={<WolframiteEntryForm/>}/>
                                    <Route path='/entry/add/lithium' element={<LithiumEntryForm/>}/>
                                    <Route path='/entry/add/beryllium' element={<BerylliumEntryForm/>}/> */}
                                    <Route path='/entry/add/:model' element={<MineralRawEntry/>}/>


                                    {/* <Route path='/entry/edit/coltan/:entryId/:requestId?' element={<ColtanEditForm/>}/>
                                    <Route path='/entry/edit/cassiterite/:entryId/:requestId?' element={<CassiteriteEditForm/>}/>
                                    <Route path='/entry/edit/wolframite/:entryId/:requestId?' element={<WolframiteEditForm/>}/>
                                    <Route path='/entry/edit/lithium/:entryId' element={<LithiumEditForm/>}/>
                                    <Route path='/entry/edit/beryllium/:entryId' element={<BerylliumEditForm/>}/> */}
                                    <Route path='/entry/edit/:model/:entryId/:requestId?' element={<MineralEntryEdit/>}/>


                                    <Route path='/complete/coltan/:entryId' element={<ColtanEntryCompletePage/>}/>
                                    <Route path='/complete/cassiterite/:entryId' element={<CassiteriteEntryCompletePage/>}/>
                                    <Route path='/complete/wolframite/:entryId' element={<WolframiteEntryCompletePage/>}/>
                                    <Route path='/complete/beryllium/:entryId' element={<BerylliumEntryCompletePage/>}/>
                                    <Route path='/complete/lithium/:entryId' element={<LithiumEntryCompletePage/>}/>

                                    <Route path='/coltan/request' element={<ColtanEditRequestPage/>}/>

                                    <Route path='/users' element={<UsersListPage/>}/>

                                    <Route path='/user/edit/:userId' element={<UserPermissionPage/>}/>

                                    <Route path='/test' element={<EditMinesitePage/>}/>
                                    <Route path='/sales' element={<SalesListPage/>}/>
                                    <Route path='/purchases' element={<PurchasesListPage/>}/>
                                    <Route path='/profile' element={<UsersListPage/>}/>
                                    <Route path='/suppliers' element={<SuppliersListPage/>}/>
                                    <Route path='/add/supplier' element={<AddSuplierPage/>}/>
                                    <Route path='/supplier/details/:supplierId' element={<SupplierDetailsPage/>}/>
                                    <Route path='/edit/supplier/:supplierId' element={<EditSuplierPage/>}/>
                                    <Route path='/edit/supplier/minesite/:supplierId' element={<EditMinesitePage/>}/>
                                    <Route path='/payments' element={<RoleBasedRoute element={<PaymentsListPage />} permissionKey="payments"/>}/>
                                    <Route path='/edit/payment/:paymentId' element={<EditPaymentPage/>}/>
                                    <Route path='/add/payment' element={<AddPaymentPage/>}/>
                                    <Route path='/buyers' element={<BuyersListPage/>}/>
                                    <Route path='/edit/buyer/:buyerId' element={<EditBuyerPage/>}/>
                                    <Route path='/buyer/details/:buyerId' element={<BuyerDetailsPage/>}/>
                                    <Route path='/add/buyer' element={<AddBuyerPage/>}/>
                                    <Route path='/entry/storekeeper' element={<TransactionEntry/>}/>
                                    <Route path='/entry/trecability' element={<TrecabilityData/>}/>
                                    <Route path='/add/product' element={<AddProductPage/>}/>
                                    <Route path='/add/sale' element={<AddSalesPage/>}/>
                                    <Route path='/add/purchase' element={<AddPurchasePage/>}/>
                                    <Route path='/add/user' element={<AddUserPage/>}/>
                                    <Route path='/edit/user' element={<EditUserPage/>}/>
                                    <Route path='/add/supplier' element={<AddSuplierPage/>}/>
                                    <Route path='/contracts' element={<ContractsistPage/>}/>
                                    <Route path='/add/contract' element={<AddContract/>}/>
                                    <Route path='/register' element={<RegisterPage/>}/>
                                    <Route path='/password/reset' element={<ResetPasswordPage/>}/>
                                    <Route path='/password/forgot' element={<ForgotPasswordPage/>}/>
                                    <Route path='/framer' element={<Framer/>}/>
                                    <Route path="/settings" element={<Settings/>}/>
                                    <Route path="/logs" element={<UsersActivityLogs/>}/>

                                    <Route path="/add/invoice/:supplierId/:model/:entryId" element={<AddInvoice/>}/>
                                    <Route path="/invoice" element={<InvoiceList/>}/>
                                    {/*<Route path="/invoice/temp" element={<InvoiceTemp/>}/>*/}
                                    {/* <Route path="/invoice/:supplierName/:supplierId" element={<SuppliersInvoice/>}/> */}

                                    <Route path="/edit-requests" element={<EditRequests/>}/>
                                    <Route path="/user" element={<UserPermissionPage/>}/>
                                    <Route path="/chat" element={<Chat/>}/>
                                    <Route path="/new" element={<NewUSerChart/>}/>
                                    <Route path="/structure" element={<FileStructure/>}/>
                                    <Route path="/simbo" element={<SingleImageUpload/>}/>
                                    <Route path="/dashboard" element={<DashboardPage/>}/>
                                    <Route path="/due-diligence-report/:supplierId/:startDate/:endDate" element={<PrepareDDReport/>}/>
                                    <Route path="/structure/:url/:filePath/:fileId" element={<EditExistingFile/>}/>
                                    <Route path="/lab-report/:model/:entryId/:lotNumber" element={<GenerateLabReport/>}/>
                                    <Route path="/document-editor" element={<DocumentEditorComponent/>}/>
                                    <Route path="/pdf-viewer/:documentUrl" element={<PDFViewer/>}/>
                                    <Route path="/shipment/forward-note/:shipmentId" element={<GenerateForwardNote/>}/>
                                    <Route path='/tags' element={<ListTags/>}/>
                                    <Route path='/add/tag' element={<AddTag/>}/>
                                    <Route path="/supplier/invoices/:supplierId" element={<InvoiceList/>}/>
                                    <Route path="/advance-payment/edit/:paymentId" element={<EditAdvancePayment/>}/>

                                    <Route path="/expenses" element={<Expenses/>}/>
                                    <Route path="/expenses/add" element={<AddExpense/>}/>

                                    <Route path="/beneficiaries" element={<Beneficiaries/>}/>
                                    <Route path="/assets" element={<AssetsList/>}/>
                                    <Route path="/assets/add" element={<AddAsset/>}/>
                                    <Route path="/yoo" element={<StyleTestPage/>}/>
                                    <Route path="/m" element={<MineralRawEntry/>}/>
                                </Route>
                                {/*<Route path='*' element={<Navigate to="" replace/>}/>*/}
                            </Route>
                        </Route>

                        {/* <Route element={<Layout/>}>
        <Route  path='/' element={<ListContainer/>}/>
        <Route  path='/add/product' element={<ActionsPagesContainer/>}/>
       
      </Route> */}
                    </Routes>
                </SocketContext.Provider>
            </BrowserRouter>
        </>
    )
}

export default App
