import React, { useState } from 'react';
import '../../pages/Add/Add.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Add = ({ url, refreshList }) => { // Added refreshList as a prop
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Salad',
        price: '',
    });

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.name || !formData.price) {
            toast.warn("Please fill in all required fields.", { position: "top-right" });
            return;
        }

        const submitData = new FormData();
        submitData.append("name", formData.name);
        submitData.append("description", formData.description);
        submitData.append("price", Number(formData.price));
        submitData.append("category", formData.category);
        if (image) submitData.append("image", image);

        try {
            const response = await axios.post(`${url}/api/food/add`, submitData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data.success) {
                toast.success("Product added successfully!", { position: "top-right" });

                // 🔥 Fetch the updated food list immediately after adding a new item
                refreshList();  

                setFormData({ name: '', description: '', category: 'Salad', price: '' });
                setImage(null);
            } else {
                toast.error("Failed to add product: " + response.data.message, { position: "top-right" });
            }
        } catch (error) {
            toast.error("Error submitting data: " + (error.response?.data?.message || error.message), { position: "top-right" });
        }
    };

    return (
        <div className="add">
            <ToastContainer />
            <form className="flex-col" onSubmit={handleSubmit}>
                <div className="add-img-upload flex-col">
                    <p>Upload Image</p>
                    <label htmlFor="image" className="upload-box">
                        {image ? (
                            <img src={URL.createObjectURL(image)} alt="Upload Preview" />
                        ) : (
                            <div className="upload-placeholder">
                                <p>Upload</p>
                            </div>
                        )}
                    </label>
                    <input onChange={handleImageChange} type="file" id="image" hidden />
                </div>

                <div className="add-product-name flex-col">
                    <p>Product name</p>
                    <input
                        type="text"
                        name="name"
                        placeholder="Type here"
                        required
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="add-product-description flex-col">
                    <p>Product description</p>
                    <textarea
                        name="description"
                        rows="4"
                        placeholder="Write content here"
                        value={formData.description}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <p>Product category</p>
                        <select name="category" required value={formData.category} onChange={handleChange}>
                            <option value="Salad">Salad</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Deserts">Deserts</option>
                            <option value="Sandwich">Sandwich</option>
                            <option value="Cake">Cake</option>
                            <option value="Pure Veg">Pure Veg</option>
                            <option value="Pasta">Pasta</option>
                            <option value="Noodles">Noodles</option>
                        </select>
                    </div>
                    <div className="add-price flex-col">
                        <p>Product price</p>
                        <input
                            type="number"
                            name="price"
                            placeholder="20"
                            required
                            value={formData.price}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <button type="submit" className="add-btn">ADD</button>
            </form>
        </div>
    );
};

export default Add;
