import React, { useEffect, useState } from 'react'; 
import './List.css';
import axios from 'axios';
import { toast } from "react-toastify";

const List = ({ url }) => {
    const [list, setList] = useState([]);

    // Fetch Food List from API
    const fetchList = async () => {
        try {
            console.log("Fetching food list from:", `${url}/api/food/list`);
            
            // Ensure backend is not limiting the number of items
            const response = await axios.get(`${url}/api/food/list?limit=100`); 

            console.log("Full API Response:", response.data);

            if (response.data.success) {
                setList(response.data.data); // Ensure all items are stored
                console.log("Updated food list in state:", response.data.data);
            } else {
                toast.error("Error fetching food list");
            }
        } catch (error) {
            toast.error("Request failed");
            console.error("Fetch List Error:", error.response || error);
        }
    };

    // Remove Food Item
    const removeFood = async (foodId) => {
        try {
            console.log(`Removing food item with ID: ${foodId}`);
            await axios.post(`${url}/api/food/remove`, { id: foodId });

            toast.success("Food item removed successfully");
            await fetchList(); // Refresh list after removal
        } catch (error) {
            toast.error("Failed to remove food item");
            console.error("Remove Food Error:", error.response || error);
        }
    };

    // Fetch list on component mount
    useEffect(() => {
        fetchList();
    }, []);

    // Debug: Log food list whenever it updates
    useEffect(() => {
        console.log("Food list updated in state:", list);
    }, [list]);

    return (
        <div className='list add flex-col'>
            <p>All Foods List</p>
            <div className="list-table">
                <div className="list-table-format title">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Price</b>
                    <b>Action</b>
                </div>
                {list.length > 0 ? (
                    list.map((item) => (
                        <div key={item._id} className='list-table-format'>
                            <img src={`${url}/images/${item.image}`} alt={item.name} />
                            <p>{item.name}</p>
                            <p>{item.category}</p>
                            <p>${item.price}</p>
                            <p onClick={() => removeFood(item._id)} className='cursor'>X</p>
                        </div>
                    ))
                ) : (
                    <p>No food items found.</p>
                )}
            </div>
        </div>
    );
};

export default List;
