import React, { useEffect, useState, Fragment } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { PiCaretLeftLight, PiWindowsLogoDuotone, PiHandbagDuotone, PiUserDuotone, PiUsersDuotone,PiUserPlusDuotone, PiEnvelopeLight, PiCubeDuotone, PiShieldDuotone, PiGlobeSimpleLight, PiCaretRightLight, PiUser, PiSquaresFourDuotone, PiDeviceMobileCameraDuotone, PiPlusSquareDuotone, PiCubeTransparentDuotone, PiTagDuotone, PiSpeakerHifiDuotone, PiBarcodeDuotone, PiArrowsInSimpleDuotone, PiShoppingCartSimpleDuotone, PiFilesDuotone, PiFileTextDuotone, PiFloppyDiskDuotone, PiArrowsClockwiseDuotone, PiArrowBendUpLeftDuotone, PiDatabaseDuotone, PiSignInDuotone, PiChartPieDuotone, PiHouseDuotone, PiBrowserDuotone, PiFileMinusDuotone, PiGearDuotone, PiFileDuotone, PiShoppingBagDuotone, PiBellSimpleLight, PiGearLight,PiHandshakeDuotone,PiTruckDuotone,PiFolderSimpleDuotone  } from "react-icons/pi";
import { GoHistory } from "react-icons/go";
import { LuBarChart2 } from "react-icons/lu"
import { GiDiamondHard } from "react-icons/gi"
import { PiCurrencyEthDuotone } from "react-icons/pi"
import { TbArrowsCross } from "react-icons/tb"
import Appbar from "./Appbar";
import Sidebar from "./sidebar";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../states/apislice";
import { setAuthToken, setPermissions, setUserData } from "../states/slice";
import {GoFileDirectory} from "react-icons/go";

const Layout = () => {
    const { userData } = useSelector(state => state.persistedReducer?.global);
    const dispatch =useDispatch();
    const [open, setOpen] = useState(false);
    const [userSubmenu, setUserSubmenu] = useState(false);
    const [userSubmenuMobile, setUserSubmenuMobile] = useState(false);
    const navigate = useNavigate();
    const[userLogout,{isLoading,isSuccess,isError,error}]=useLogoutMutation();
    if (!userData) navigate('/login');
    const { permissions } = userData;


    const decideShowMenu = (permissionKey) => {
        if (permissions && permissions[permissionKey]) {
            Object.keys(permissions[permissionKey]).forEach(key => {
                if (permissions[permissionKey][key]) {
                    return true;
                }
            })
        }
    }

    const opennav = () => {
        setOpen(!open)
    }

    const handleUserSubmenu = () => {
        setUserSubmenu(!userSubmenu);
    }
    const handleUserSubmenuMobile = () => {
        setUserSubmenuMobile(!userSubmenuMobile);
    }

    const handleLogOut=async()=>{
        const body={username: userData.username, _id:userData._id}
        await userLogout({body});
        dispatch(setAuthToken(null));
        dispatch(setUserData(null));
        dispatch(setPermissions(null));
        navigate('/login');
    }
    const menu = [
        {
            heading: "Main", hId: 1, subHeaders: [
                { title: "Dashboard", show: permissions.dashboard?.view, icon: <PiSquaresFourDuotone />, id: 10,navtext:'dashboard' },
                {
                    title: "Application", id: 11, icon: <PiDeviceMobileCameraDuotone />, submenu: true,
                    submenuItems: [
                        { title: "Chat", id: 12,navtext:'chat' },
                        // { title: "Calender", id: 13 },
                        // { title: "Email", id: 14 }
                    ], line: true
                }
            ]
        },
        {
            heading: "Entry", show: permissions?.entry.view,  hId:2 , subHeaders: [
                { title: "Coltan", show: permissions?.entry.view, icon: <PiCurrencyEthDuotone />, id: 15,navtext:'coltan' },
                { title: "Cassiterite", show: permissions?.entry.view, icon: <PiCurrencyEthDuotone />, id: 16,navtext:'cassiterite' },
                { title: "Wolframite", show: permissions?.entry.view, icon: <PiCurrencyEthDuotone />, id: 17,navtext:'wolframite' },
                { title: "Lithium", show: permissions?.entry.view, icon: <PiCurrencyEthDuotone />, id: 18,navtext:'lithium' },
                { title: "Beryllium", show: permissions?.entry.view, icon: <PiCurrencyEthDuotone />, id: 19,navtext:'beryllium' },
                { title: "Mixed", show: permissions?.entry.view, icon: <PiCurrencyEthDuotone />,submenu: true, id: 20,submenuItems: [
                    { title: "Cassiterite and Coltan ", show: permissions?.entry.view, id: 86,navtext:"mixed" },
                    // { title: "Cassiterite and Wolframite", id: 87,navtext:"mixed" }
                ]},
                // { title: "Special", icon: <PiArrowsInSimpleDuotone />, line: true, id: 21,navtext:'special' },
            ]
        },
        {
            heading: "Shipments", show: permissions.shipments?.view, hId: 3, subHeaders: [
                { title: "Shipments list", show: permissions.shipments?.view, icon: <PiShoppingCartSimpleDuotone />, id: 22,navtext:"shipments",},
                { title: "Add", show: permissions.shipments?.create && permissions.shipments?.view, icon: <PiFileTextDuotone />, submenu: true, id: 23,submenuItems: [
                    { title: "Coltan", id: 24,navtext:"shipment/add/coltan" },
                    { title: "Cassiterite", id: 25,navtext:"shipment/add/cassiterite" },
                    { title: "Wolframite", id: 26,navtext:"shipment/add/wolframite" },
                    { title: "Lithium", id: 27,navtext:"shipment/add/lithium" },
                    { title: "Beryllium", id: 28,navtext:"shipment/add/beryllium" }
                ]},

            ]
        },
                
        {
            heading: "Tags", show: permissions.tags?.view, hId: 79, subHeaders: [
                { title: "List Tags", show: permissions.tags?.view, icon: <PiTagDuotone />, id: 80,navtext:"tags"},
                { title: "Add", show: permissions.tags?.create && permissions.tags?.view, icon: <PiTagDuotone />, id: 80,navtext:"add/tag",line: true },
            ]
        },

        {
            heading: "Suppliers", show: permissions.suppliers?.view, hId: 4, subHeaders: [
                { title: "Suppliers List", show: permissions.suppliers?.view, icon: <PiTruckDuotone />, id: 32,navtext:"suppliers" },
                { title: "Add", show: permissions.suppliers?.create && permissions.suppliers?.view, icon: <PiUserPlusDuotone />, id: 33,navtext:"add/supplier", line: true, },
                // { title: "Purchase Order", icon: <PiFileMinusDuotone />, id: 27,navtext:"" },
                // { title: "Purchase Return", icon: <PiArrowsClockwiseDuotone />, line: true, id: 28,navtext:"" },
            ]
        },

        {
            heading: "Buyers", show: permissions.buyers?.view, hId: 81, subHeaders: [
                { title: "Buyers", show: permissions.buyers?.view, icon: <PiHandshakeDuotone />, id: 82,navtext:"buyers"},
                { title: "Add", show: permissions.buyers?.create && permissions.buyers?.view, icon: <PiUserPlusDuotone />, id: 83,navtext:"add/buyer",line: true },
            ]
    },
        // {
        //     heading: "Finance & acconts", hId: 5, subHeaders: [
        //         {
        //             title: "Expenses", icon: <PiFileTextDuotone />, submenu: true, submenuItems: [
        //                 { title: "Expenses", id: 34 },
        //                 { title: "Expenses Category", id: 35 }
        //             ], line: true
        //         }]
        // },
        {
            heading: "Users", hId: 6, show: permissions.users?.view, subHeaders: [
                // { title: "Customers", icon: <PiUserDuotone />, id: 36 },
                // { title: "Suppliers", icon: <PiUsersDuotone />, id: 37 },
                { title: "Users", show: permissions.users?.view, icon: <PiUserDuotone />, id: 38, navtext:'users' },
                { title: "Add", show: permissions.users?.create && permissions.users?.view, icon: <PiUserPlusDuotone />, id: 39,navtext:"add/user", line: true, },
            ]
        },
        {
            heading: "Contracts", show: permissions.contracts?.view, hId: 7, subHeaders: [
                { title: "Contracts list", show: permissions.contracts?.view, icon: <PiFileTextDuotone />, id: 40,navtext:"contracts", line: true, },
                // { title: "Purchase Report", icon: <PiChartPieDuotone />, id: 41 },
                // { title: "Inventory Report", icon: <PiBrowserDuotone />, id: 42 },
                // { title: "Supplier Report", icon: <PiDatabaseDuotone />, id: 44 },
                // { title: "Customer Report", icon: <PiChartPieDuotone />, line: true, id: 45 }
            ]
        },
        {
            heading: "Finance", show: permissions.payments?.view, hId: 8, subHeaders: [
                {
                    title: "Payments", show: permissions.payments?.view, icon: <PiUsersDuotone />, id: 46,navtext:"payments"
                },
                {
                    title: "Advanced Payment", show: permissions.payments?.view, icon: <PiUsersDuotone />, id: 57,navtext:"advanced-payment", line: true,
                },
                // { title: "Invoice ", icon: <PiFileDuotone />, id: 43,navtext:'invoice', line: true, },
            ]
        },
        {
            heading: "File Directory", show: permissions.fileDirectory?.view, hId: 84, subHeaders: [
                { title: "Directory", show: permissions.fileDirectory?.view, icon: <GoFileDirectory />, id: 85,navtext:"structure",line: true },
            ]
        },
        {
            heading: "History", show: permissions.users?.view, hId: 87, subHeaders: [
                { title: "Activity logs", show: permissions.users?.view, icon: <GoHistory />, id: 88,navtext:"logs",line: true },
            ]
        },
        {
            heading: "Settings", show: permissions.settings?.view, hId: 9, subHeaders: [
                {
                    title: "Settings", show: permissions.settings?.view, icon: <PiGearDuotone />, submenu: true, id: 49, submenuItems: [
                        { title: "General Settings", id: 50,navtext:"settings" },
                        // { title: "Email Settings", id: 51 },
                        // { title: "Payment Settings", id: 52 },
                        // { title: "Currency Settings", id: 53 },
                        // { title: "Group Permissions", id: 54 },
                        // { title: "Tax Rates", id: 55 },
                    ],
                },
                // { title: "Logout", icon: <PiSignInDuotone />, id: 56 },
            ]
        },
    ]

    const keyMap = {
        "main": "main",
        "dashboard": "dashboard",
        "entry": "entry",
        "shipments": "shipments",
        "tags": "tags",
        "suppliers": "suppliers",
        "buyers": "buyers",
        "users": "users",
        "contracts": "contracts",
        "payments": "payments",
    }

    // Define the roles and their associated menu item IDs and restricted item IDs
    const roleMenus = {
        admin: {
            allowedSections: [1, 7, 15, 24, 29, 32, 37, 44, 48,79,81, 84, 84,87],
            restrictedItems: {
                7: [11, 12], // For section with hId 7, restrict items 11 and 12
                15: [19, 58], // For section with hId 15, restrict items 19 and 58
                // Add more restricted items for specific sections as needed
            }
        },
        ceo: {
            allowedSections: [1, 2,3,4,5,6,7,8,9,79,81,84, 85,87],
            restrictedItems: {
                15: [19, 58], // For section with hId 15, restrict items 19 and 58
                // Add more restricted items for specific sections as needed
            }
        },
        employee: {
            allowedSections: [1, 7, 15, 24, 32,29, 37, 44, 48,79,81,87],
            restrictedItems: {
                // Define restricted items for employee role if needed
            }
        },
        // Add more roles and associated menu item IDs and restrictions as needed
    };

    // Define the user's role and user ID (change these values as needed)
    const userRole = 'ceo'; // Change this to 'ceo', 'employee', etc.
    const userId = 123; // Change this to the actual user ID

    // Filter the original menu based on the user's role and restrictions
    const filteredMenu = menu.filter(section => roleMenus[userRole].allowedSections.includes(section.hId))
        .map(section => {
            if (section.subHeaders && section.subHeaders.length > 0) {
                const restrictedItems = roleMenus[userRole].restrictedItems[section.hId];
                if (restrictedItems) {
                    section.subHeaders = section.subHeaders.filter(item => !restrictedItems.includes(item.id));
                }
            }
            return section;
        });

    // Output the filtered menu


    return (
        <>

            <>
                {/* App bar */}
                <Appbar userSubmenu={userSubmenu}
                userSubmenuMobile={userSubmenuMobile}
                    // handleUserSubmenu={handleUserSubmenu}
                    handleUserSubmenuMobile={handleUserSubmenuMobile} />

                {/* side bar */}
                <Sidebar filteredMenu={filteredMenu}
                    opennav={opennav}
                    open={open} 
                    logOut={handleLogOut}/>
                <div className={`content ml-14 -translate-x-0  transform ease-in-out duration-700 pt-20 px-2 h-screen md:px-5 pb-4 ${open && ' ml-[194px]'}`}>
                    <Outlet />
                </div>

            </>



        </>
    )
}
export default Layout;