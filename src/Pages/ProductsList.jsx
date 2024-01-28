import ProductListContainer from "../components/Listcomponents/ProductListContainer";
import BasicTable from "../components/tables/BasicTable";

const ProductsList = () => {

    return (
        <>
            <ProductListContainer title={'Product list'}
                subTitle={'Manage product list'}
                navLinktext={'add/product'}
                navtext={'Add new product'}
                table={< BasicTable />} />
        </>
    )
}
export default ProductsList;