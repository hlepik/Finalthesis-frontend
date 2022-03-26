import {FC, useContext, useEffect} from "react";
import {AppContext} from "../context/AppContext";
import {Box, Card, CardMedia, Grid, Typography} from "@mui/material";

interface PatternCard {
    title: string;
    picture: string;

}

const PatternCard: FC<PatternCard> = ({title, picture}) => {
    return (
        <>
                <div className='PictureCard'>
                        <img src={picture} className='Image' alt={title}/>

                            <div className='TitleGrid'>
                                <Typography variant='h2'>{title}</Typography>
                            </div>
                </div>


        </>
    );
}
export default PatternCard;