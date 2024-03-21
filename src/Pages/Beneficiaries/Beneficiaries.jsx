import React, {useEffect, useState} from 'react';
import ListContainer from "../../components/Listcomponents/ListContainer";
import { useGetBeneficiariesQuery } from "../../states/apislice";
import {ImSpinner2} from "react-icons/im";
import {Table} from "antd";
// import AddBeneficiary from "./AddBeneficiary";
// import EditBeneficiary from "./EditBeneficiary";
// import DeleteBeneficiary from "./DeleteBeneficiary";



const Beneficiaries = () => {

    const [beneficiaries, setBeneficiaries] = useState([]);
    const { data, isLoading, isSuccess } = useGetBeneficiariesQuery();

    useEffect(() => {
        if (isSuccess) {
            const { beneficiaries } = data?.data;
            setBeneficiaries(beneficiaries);
        }
    }, [data, isSuccess]);

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
            render: (_, record) => {
                if (!record.address) return null;
                const { province, district, sector } = record.address;
                return <span>{`${province}, ${district}, ${sector}`}</span>
            }
        },
        {
            title: "Phone Number",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
        },
    ]

    return (
        <>
            <ListContainer
                title={"Beneficiareis"}
                subTitle={"List of all Beneficiaries"}
                // navLinktext={"assets/add"}
                isAllowed={false}
                navtext={"Add Beneficiary"}
                table={
                    <>
                        <div className="flex p-2 w-full items-end justify-end">
                            Add Beneficiary
                            {/*<AddBeneficiary/>*/}
                        </div>
                        <Table
                            className=" w-full overflow-x-auto"
                            loading={{
                                indicator: (
                                    <ImSpinner2
                                        style={{width: "60px", height: "60px"}}
                                        className="animate-spin text-gray-500"
                                    />
                                ),
                                spinning: isLoading,
                            }}
                            dataSource={beneficiaries}
                            columns={columns}
                            pagination={{pageSize: 100, size: "small"}}
                            rowKey="_id"
                        />
                    </>
                }
            />
        </>
    )
}

export default Beneficiaries;