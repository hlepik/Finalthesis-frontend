import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Grid, styled, Typography } from "@mui/material";
import PatternCard from "../components/PatternCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { BaseService } from "../service/base-service";
import { IInstruction } from "../dto/IInstruction";
import { PicturePath } from "../configuration";
import { COLOR_LIGHT_GRAY } from "../utils/constants";
import BasicButton from "../components/BasicButton";

const StyledTitle = styled(Typography)({
    marginBottom: "1rem",
    marginTop: "1rem",
    marginLeft: "1rem",
    fontWeight: 600,
});
const AdGrid = styled(Grid)({
    backgroundColor: COLOR_LIGHT_GRAY,
    height: "10rem",
});
const StyledAdGrid = styled(Grid)({
    display: "flex",
    justifyContent: "center",
    paddingTop: "3rem",
    columnGap: "2rem",
});
const StyledGrid = styled(Grid)({
    backgroundColor: "rgba(247, 216, 123, 0.4)",
    display: "flex",
    flexDirection: "row",
    width: "100%",
});
const TextGrid = styled(Grid)({
    margin: "1rem",
    width: "100%",
    height: "100%",
});
const StyledTextGrid = styled(Grid)({
    height: "10rem",
});

const ImageGrid = styled(Grid)({
    width: "300px",
    margin: "1rem",
});
const HomePage = () => {
    const [instruction, setInstruction] = useState<IInstruction[]>([] as IInstruction[]);

    const appState = useContext(AppContext);

    const loadData = useCallback(async () => {
        let result = await BaseService.getAll<IInstruction>("/Instructions/GetLastInserted/patterns", appState.token!);
        if (result.ok && result.data) {
            setInstruction(result.data);
        }
    }, [appState]);
    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <>
            <Grid className="layoutContainer">
                <StyledTitle variant="h1">Viimati lisatud lõiked</StyledTitle>

                <Swiper
                    modules={[Navigation, Pagination, Scrollbar, A11y]}
                    slidesPerView={4}
                    navigation
                    watchOverflow={true}
                >
                    {instruction.map((item) => (
                        <SwiperSlide key={item.id}>
                            <PatternCard
                                id={item.id}
                                title={item.name}
                                picture={`${PicturePath}${item.mainPictureName}`}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Grid>
            <AdGrid>
                <StyledAdGrid>
                    <Typography variant={"h2"}> Siia tuleb Reklaam...</Typography>
                </StyledAdGrid>
            </AdGrid>
            <Grid className={"layoutContainer"}>
                <StyledTitle variant="h1">Uudised</StyledTitle>

                <StyledGrid>
                    <ImageGrid>
                        <img src={"/images/imagee.png"} />
                    </ImageGrid>
                    <TextGrid>
                        <Typography variant={"h4"}>Uudise pealkiri</Typography>
                        <Typography variant={"body2"}>
                            Siia on plaan lisada uudiseid, mis on seotud õmblemisega. Näiteks informatsioon kuidas
                            mingeid protsesse läbida või kuidas töödelda erinevaid kangaid. Samuti uudised erinevate
                            firmade kohta. Miks mitte ka mõned kasutajalood.
                        </Typography>
                    </TextGrid>
                </StyledGrid>
            </Grid>
        </>
    );
};
export default HomePage;
