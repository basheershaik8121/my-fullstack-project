import React, { useState } from 'react'; // ✅ Import useState
import './Home.css';
import Header from '../../components/Navbar/Header/Header';
import ExploreMenu from '../../components/Navbar/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import AppDownload from '../../components/AppDownload/AppDownload';

const Home = () => {
    const [category,setCategory] = useState("All"); // ✅ Now useState works

    return (
        <div>
            <Header />
            <ExploreMenu category={category} setCategory={setCategory} />
            <FoodDisplay category={category} />
            <AppDownload />
            
        </div>
    );
};

export default Home;
