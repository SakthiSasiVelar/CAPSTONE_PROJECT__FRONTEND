
import { Button, Table, Space } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import AddToyForm from '../ToyForm/AddToyForm';
import UpdateToyForm from '../UpdateToyForm/UpdateToyForm';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../utils/config';
import { formatErrorMessage , formatSuccessMessage } from '../../utils/responseFormatter';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setBrandItemValues } from '../../Slices/brandSlice';
import { setCategoryListValues } from '../../Slices/categorySlice';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from '../Spinner/LoadingSpinner';
import ShimmerTable from '../Shimmer/ShimmerTable';



const AdminToyPanel = () => {
    const [addVisible, setAddVisible] = useState(false);
    const [updateVisible, setUpdateVisible] = useState(false);
    const [selectedToy, setSelectedToy] = useState(null);
    const [toyList , setToyList] = useState(null);
    const[categoryList , setCategoryList] = useState(null);
    const [brandList , setBrandList] = useState(null);
    const [isLoading , setIsLoading] =useState(false)
    const dispatch = useDispatch();
    const token = sessionStorage.getItem('token');
    let newToyList;


    async function callFetchtoyDetailApi(){
        try{
            const response = await fetch(API_BASE_URL + `toy/getAll`,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
             if(!response.ok){
                const errorCode = response.status;
                switch(errorCode){
                    case 401:
                      return formatErrorMessage(401 , 'Unauthorized');
                    case 403:
                       return formatErrorMessage(403 , 'Forbidden');

                }
            }
            const result = await response.json();

            if(result.status === 'success'){
                return formatSuccessMessage(200 , ' Toy  details  fetched successfully' ,result.data);
            }
            else if(result.status === 'error'){
                const errorCode = result.statusCode;
                console.log(result.message);
                switch(errorCode){
                    case 400:
                    return formatErrorMessage(400 ,'Please check the user id');
                    case 500:
                        return formatErrorMessage(500 ,'Error in getting toy  details ');
                    default:
                        return formatErrorMessage(errorCode ,result.message);
                }
            }
        }
        catch(error){
            return error;
        }
    }

      async function fetchCategories(){
        try{
            const response = await fetch(API_BASE_URL + `category/getAll`);
            const result = await response.json();

            if(result.status === 'success'){
                return formatSuccessMessage(200 , 'Categories details list fetched successfully' ,result.data);
            }
            else if(result.status === 'error'){
                const errorCode = result.statusCode;
                console.log(result.message);
                switch(errorCode){
                    case 400:
                    return formatErrorMessage(400 ,'Please check the user id');
                    case 500:
                        return formatErrorMessage(500 ,'Error in getting categories details list');
                    default:
                        return formatErrorMessage(errorCode ,result.message);
                }
            }
        }
        catch(error){
            return error;
        }
    }

    async function fetchBrands()
    {
        try{
            const response = await fetch(API_BASE_URL + `brand/getAll`);
            const result = await response.json();

            if(result.status === 'success'){
                return formatSuccessMessage(200 , 'Brand details list fetched successfully' ,result.data);
            }
            else if(result.status === 'error'){
                const errorCode = result.statusCode;
                console.log(result.message);
                switch(errorCode){
                    case 400:
                    return formatErrorMessage(400 ,'Please check the user id');
                    case 500:
                        return formatErrorMessage(500 ,'Error in getting brand details list');
                    default:
                        return formatErrorMessage(errorCode ,result.message);
                }
            }
        }
        catch(error){
            return error;
        }
    }

    useEffect(() =>{
        let error;
        async function getToyDetailsList(){
            try{
                const result = await callFetchtoyDetailApi();
                if(result.status ==='success'){
                    setToyList(result.data)
                }
                else{
                     if(result.errorCode === 401 || result.errorCode === 403){
                        toast.error('Please login as admin to see toy details' );
                        return;
                    }
                   error = true;
                }
            }
            catch(error){
                console.log(error);

            }
        }
        async function callFetchCategoryApi(){
            try{
                var result = await fetchCategories();
                if(result.status === 'success'){
                    setCategoryList(result.data)
                    dispatch(setCategoryListValues(result.data))
                }
                else{
                    console.log(result);
                    error = true;
                }
            }
            catch(error){
                console.log(error);
                error = true;
            }
        }
        async function callFetchBrandApi(){
            try{
                var result = await fetchBrands();
                if(result.status === 'success'){
                    setBrandList(result.data)
                    dispatch(setBrandItemValues(result.data))
                }
                else{
                    console.log(result)
                    error = true;
                }
            }
            catch(error){
                console.log(error);
                error = true
            }
        }

        callFetchCategoryApi();
        callFetchBrandApi();
        getToyDetailsList();

        if(error){
             toast.error('Please try again');
             error = false;
        }
    } , [])


    function getCategoryNameById(id){
        return categoryList.find((category) => category.categoryId === id)?.categoryName;
    }

    function getBrandNameById(id) {
        return brandList.find((brand) => brand.brandId === id)?.brandName;
    }

    if(toyList !==null && categoryList !== null && brandList !== null){
       newToyList = toyList.map((item) => {
        return {
            toyId: item.toyId,
            name: item.name,
            category: getCategoryNameById(item.categoryId),
            brand: getBrandNameById(item.brandId),
            quantity: item.quantity,
            price: item.price,
            discount: item.discount,
            ageRange: item.ageRange,
        };
    })
    }

    

    const toyColumns = [
        {title: 'ToyId' , dataIndex:'toyId',key:'toyId'},
        { title: 'Toy Name', dataIndex: 'name', key: 'name' },
        { title: 'Category', dataIndex: 'category', key: 'category' },
        { title: 'Brand', dataIndex: 'brand', key: 'brand' },
        { title: 'Age Range', dataIndex: 'ageRange', key: 'ageRange' },
        { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Price', dataIndex: 'price', key: 'price' , render: (price) => `₹${price}`, },
        { title: 'Discount', dataIndex: 'discount', key: 'discount' },
        
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setSelectedToy(record);
                            setUpdateVisible(true);
                        }}
                    >
                        Update
                    </Button>
                </Space>
            ),
        },
    ];

    async function callAddToyApi(addToyDetails){
      try
         {
            const response = await fetch(API_BASE_URL +'toy/add' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(addToyDetails)
            });

             if(!response.ok){
                const errorCode = response.status;
                switch(errorCode){
                    case 401:
                      return formatErrorMessage(401 , 'Unauthorized');
                    case 403:
                       return formatErrorMessage(403 , 'Forbidden');

                }
            }
            const result = await response.json();
        
            if(result.status === 'success'){
                return formatSuccessMessage(201 , 'Toy  Details added successfully' , result.data);
            }
            else if(result.status === 'error'){
                const errorCode = result.statusCode;
                switch(errorCode){
                    case 400:
                        return formatErrorMessage(400 ,'Please check the input and try again');                  
                    case 500:
                        return formatErrorMessage(500 , 'Failed to add toy details.Please try again');
                    default:
                        return formatErrorMessage(errorCode ,result.message);
                }
            }
        }
        catch(error){
            return error;
        }
    }

    async function addToyDetailsFunc(addToyDetails){
        try{
            const result = await callAddToyApi(addToyDetails);
            if(result.status ==='success'){      
                setToyList((prev) =>{
                    return [result.data , ...prev];
                });
                setIsLoading(false);
                 toast.success('Toy details added successfully');
            }
            else{
                 if(result.errorCode === 401 || result.errorCode === 403){
                        toast.error('Please login to add toy' );
                        setIsLoading(false)
                        return;
                    }
                toast.error('Failed to add toy');
                setIsLoading(false);
            }
        }
        catch(error){
            console.log(error);
            toast.error('Failed to add toy');
            setIsLoading(false);
        }
    }

    async function callUpdateToyApi(newToyDetails){
        try
         {
            const response = await fetch(API_BASE_URL +'toy/update' , {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newToyDetails)
            });

             if(!response.ok){
                const errorCode = response.status;
                switch(errorCode){
                    case 401:
                      return formatErrorMessage(401 , 'Unauthorized');
                    case 403:
                       return formatErrorMessage(403 , 'Forbidden');

                }
            }
            const result = await response.json();
        
            if(result.status === 'success'){
                return formatSuccessMessage(201 , 'Toy  Details updated successfully' , result.data);
            }
            else if(result.status === 'error'){
                const errorCode = result.statusCode;
                switch(errorCode){
                    case 400:
                        return formatErrorMessage(400 ,'Please check the input and try again');                  
                    case 500:
                        return formatErrorMessage(500 , 'Failed to update toy details.Please try again');
                    default:
                        return formatErrorMessage(errorCode ,result.message);
                }
            }
        }
        catch(error){
            return error;
        }
    }

      async function updateToyDetail(newToyDetails){
        try{
            const result = await callUpdateToyApi(newToyDetails);
            if(result.status ==='success'){      
               setToyList((prev) => {
                    return prev.map(item => 
                        item.toyId === result.data.toyId ? result.data : item
                    );
                });
                setIsLoading(false);
                toast.success('Toy details updated successfully');
            }
            else{
                 if(result.errorCode === 401 || result.errorCode === 403){
                        toast.error('Please login as admin to update toy' );
                        setIsLoading(false)
                        return
                    }
                toast.error('Failed to update toy');
                setIsLoading(false);
            }
        }
        catch(error){
            console.log(error);
            toast.error('Failed to update toy');
            setIsLoading(false);
        }
    }

    function getCategoryIdByName(name){
        return categoryList.find((category) => category.categoryName === name)?.categoryId;
    }

    function getBrandIdByName(name){
        return brandList.find((brand) => brand.brandName === name)?.brandId;
    }

    function getImageUrl(image){
        return image.file.response.data.imageUrl;
    }

    const handleAdd = (values) => {
        setAddVisible(false);
        setIsLoading(true)
        let addToyDetails = {
            name: values.name,
            description : values.description,
            categoryId: values.categoryId,
            brandId: values.brandId,
            quantity: values.quantity,
            price: values.price.toString(),
            discount: values.discount,
            ageRange: values.ageRange,
            imageUrl: getImageUrl(values.image)
        }
        addToyDetailsFunc(addToyDetails)
    };

    function getToyDetails(id){
        return toyList.find((toy) => toy.toyId === id);
    }

    const handleUpdate = (values) => {
        setUpdateVisible(false);
        setIsLoading(true)
        let oldToyDetails = getToyDetails(values.toyId);
        let newToyDetails = {
            toyId: values.toyId,
            name: values.name,
            description : oldToyDetails.description,
            categoryId: getCategoryIdByName(values.category),
            brandId: getBrandIdByName(values.brand),
            quantity: values.quantity,
            price: values.price.toString(),
            discount: values.discount,
            ageRange: values.ageRange,
            imageUrl: oldToyDetails.imageUrl
        }
        updateToyDetail(newToyDetails)
        setSelectedToy(null);
    };

     if(toyList === null || categoryList === null || brandList == null){
        return (
            <ShimmerTable />
        )
     }


    return (
        <div>
            {isLoading && <LoadingSpinner /> } 
            
            <Button
                type="primary"
                onClick={() => {
                    setAddVisible(true)
                }}
                style={{ marginBottom: '16px', backgroundColor: 'green', borderColor: 'green' }}
            >
                Add Toy
            </Button>

            <Table
                columns={toyColumns}
                dataSource={newToyList}
                pagination={{ 
                    pageSize: 7,
                }}
                style={{ marginBottom: '16px' }}
                key="toyId"
                show
            />

            <AddToyForm
                visible={addVisible}
                onClose={() => setAddVisible(false)}
                onAdd={handleAdd}
                brandList={brandList}
                categoryList={categoryList}
            />

            {selectedToy && (
                <UpdateToyForm
                    visible={updateVisible}
                    onClose={() => setUpdateVisible(false)}
                    onUpdate={handleUpdate}
                    toyData={selectedToy}
                     brandList={brandList}
                    categoryList={categoryList}
                />
            )}
        </div>
    );
};

export default AdminToyPanel;
