import {useContext, useEffect, useState} from "react";
import {AppContext} from "../context/AppContext";
import UserPage from "./user/UserPage";
import {Grid, Typography} from "@mui/material";
import PatternCard from "../components/PatternCard";
import PatternCarousel from "../components/PatternCarousel";
import {IPattern} from "../dto/IPattern";
import ItemsCarousel from "react-items-carousel";
import {Swiper, SwiperSlide} from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export interface IPictures {
    pictures: IPattern[]
}

const HomePage = () => {


    const [campaigns, setImg] = useState<IPattern[]>([{id: 1, title: 'ok', picture: '/images/imagee.png'}, {
        id: 2,
        title: 'ok',
        picture: '/images/imagee.png'
    }, {id: 3, title: 'ok', picture: '/images/imagee.png'}, {id: 4, title: 'ok', picture: '/images/imagee.png'}]);

    const [active, setaAtive] = useState(0);

    const appState = useContext(AppContext);

    useEffect(() => {

    }, []);


    return (
        <>
            <Typography variant='h1'>Viimati lisatud lõiked</Typography>
            <Grid container className='MainContainer'>

            </Grid>

            <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                slidesPerView={3}
                navigation
                watchOverflow={true}
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}
            >
                {campaigns.map((item) => (
                    <SwiperSlide key={item.id}>
                        <PatternCard title={item.title} picture={item.picture}/>
                    </SwiperSlide>
                ))}
            </Swiper>


        </>
    );
}
export default HomePage;