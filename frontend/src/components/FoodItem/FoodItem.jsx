import React, { useContext } from 'react';
import './FoodItem.css';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';

const FoodItem = ({ id, name, price, description, image }) => {
    const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);
    console.log("addToCart:", addToCart);

    return (
        <div className='food-item'>
            <div className="food-item-img-container">
                <img className='food-item-image' src={url + "/images/" + image} alt={name} />

                {!cartItems[id] ? (
                    <img 
                        className='add' 
                        onClick={() => addToCart(id)}  // ✅ Fixed function call
                        src={assets.add_icon_white} 
                        alt="Add to Cart" 
                    />
                ) : (
                    <div className='food-item-counter'>
                        <img 
                            onClick={() => removeFromCart(id)}  // ✅ Fixed function call
                            src={assets.remove_icon_red} 
                            alt="Remove from Cart" 
                        />
                        <p>{cartItems[id]}</p>
                        <img 
                            onClick={() => addToCart(id)}  // ✅ Fixed function call
                            src={assets.add_icon_green} 
                            alt="Increase Quantity" 
                        />
                    </div>
                )}
            </div>

            <div className='food-item-info'>
                <div className="food-item-name-rating">
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt="" />  {/* ✅ Keeping this unchanged as requested */}
                </div>
                <p className='food-item-desc'>{description}</p>
                <p className="food-item-price">${price}</p>
            </div>
        </div>
    );
};

export default FoodItem;
