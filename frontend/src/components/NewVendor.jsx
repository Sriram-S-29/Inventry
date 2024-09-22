import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function NewVendor() {
    const [data, setData] = useState({
        name: '',
        companyName: '',
        phno: '',
    });
  

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(data);
            const response = await axios.post('http://localhost:8000/admin/newVendor', data);
            toast.success('New vendor created');
            setData((prev)=>{
                return { name: '', companyName: '', phno: ''};
            })
        } catch (error) {
            // Enhanced error handling
            console.error('Error occurred:', error.response ? error.response.data : error.message);
            toast.error('Error occurred. Please try again.');
        }
    };
   

    return (
        <div className='absolute inset-0 m-auto flex items-center justify-center min-h-screen bg-gray-100 bg-opacity-85'>
            <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
                <h2 className='text-2xl font-bold mb-6 text-gray-800'>Add New Vendor</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-2'>
                            Name
                        </label>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            value={data.name}
                            onChange={handleChange}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='companyName' className='block text-sm font-medium text-gray-700 mb-2'>
                            Company Name
                        </label>
                        <input
                            type='text'
                            id='companyName'
                            name='companyName'
                            value={data.companyName}
                            onChange={handleChange}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='phno' className='block text-sm font-medium text-gray-700 mb-2'>
                            Phone Number
                        </label>
                        <input
                            type='text'
                            id='phno'
                            name='phno'
                            value={data.phno}
                            onChange={handleChange}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            required
                        />
                    </div>
                    
                    <button
                        type='submit'
                        className='w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300'
                    >
                        Submit
                    </button>
                </form>
            </div>

            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnHover
                draggable
                pauseOnFocusLoss
            />
        </div>
    );
}

export default NewVendor;
