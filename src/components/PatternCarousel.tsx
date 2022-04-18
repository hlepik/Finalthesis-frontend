import { FC, useState } from "react";
import { Grid, styled, Theme, useMediaQuery } from "@mui/material";
import { FreeMode, Mousewheel, Navigation, Thumbs } from "swiper";
import BasicButton from "./BasicButton";
import { Swiper as SwiperClass } from "swiper/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { IPattern } from "../dto/IPattern";
const GalleryContainer = styled(Grid)({
  height: "auto",
  width: "100%",
  columnGap: "32px",
  flexWrap: "nowrap",
});

const MainSwiperContainer = styled(Grid)({
  boxSizing: "border-box",
  order: 1,
  display: "flex",
  position: "relative",
  padding: 0,
  maxWidth: "528px !important",
});

const ThumbSwiperContainer = styled(Grid)({
  order: 0,
  display: "flex",
  maxWidth: "80px !important",
  minWidth: "80px !important",
  width: "80px",
});

const ThumbSlideContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "imgSrc",
})<{
  imgSrc: string;
}>(({ imgSrc }) => ({
  width: "100%",
  height: "80px",
  backgroundImage: `url('${imgSrc}')`,
  cursor: "pointer",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  backgroundSize: "cover",
}));

const MainSwiper = styled(Swiper, {
  shouldForwardProp: (prop) => prop !== "coverUri",
})<{
  coverUri: string;
}>(({ coverUri }) => ({
  height: "100%",
  width: "100%",
  backgroundImage: `url('${coverUri}')`,
  backgroundPosition: "center",
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  "& .swiper-slide": { height: "528px !important", width: "100% !important" },
}));

const MainSwiperSlideContent = styled("div", {
  shouldForwardProp: (prop) => prop !== "imgSrc",
})<{ imgSrc: string }>(({ imgSrc }) => ({
  backgroundImage: `url('${imgSrc}')`,
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  height: "100%",
  width: "100%",
}));

const ThumbSwiper = styled(Swiper)({
  width: "100%",
  "& .swiper-slide": {
    width: "100%",
  },
  "& .swiper-slide-thumb-active": {
    "& .thumb_identifier": {
      display: "block",
    },
  },
});

const ActiveIdentifier = styled("div")({
  display: "none",
  backgroundColor: "#FFCD00",
  position: "absolute",
  bottom: 0,
  width: "100%",
  height: "8px",
});

const PrevBtn = styled(BasicButton)(() => ({
  filter: "drop-shadow(0px 4px 16px rgba(0, 119, 200, 0.32))",
  zIndex: 2,
  position: "absolute",
  top: "calc(50% - 24px)",
  left: "16px",
}));

const NextBtn = styled(BasicButton)(() => ({
  filter: "drop-shadow(0px 4px 16px rgba(0, 119, 200, 0.32))",
  zIndex: 2,
  position: "absolute",
  top: "calc(50% - 24px)",
  right: "16px",
}));

export interface IPatternCarousel {
  coverPhoto?: string;
  images?: IPattern[];
}

const PatternCarousel: FC<IPatternCarousel> = ({ coverPhoto, images }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass>();
  const [mainSwiper, setMainSwiper] = useState<SwiperClass>();
  const [isNextBtnDisabled, setIsNextBtnDisabled] = useState<boolean>();
  const [isPrevBtnDisabled, setIsPrevBtnDisabled] = useState<boolean>();

  const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));

  const handleChangeSlide = () => {
    setIsNextBtnDisabled(mainSwiper?.isEnd);
    setIsPrevBtnDisabled(mainSwiper?.isBeginning);
  };
  return (
    <GalleryContainer container direction="row">
      <MainSwiperContainer item lg={true} xs={12}>
        <MainSwiper
          coverUri={coverPhoto || ""}
          modules={[FreeMode, Navigation, Thumbs]}
          navigation={true}
          simulateTouch={false}
          spaceBetween={10}
          thumbs={{
            swiper: thumbsSwiper,
            autoScrollOffset: 1,
            multipleActiveThumbs: false,
          }}
          updateOnWindowResize
          onSlideChange={() => handleChangeSlide()}
          onSwiper={setMainSwiper}
        >
          {!isTablet ? null : (
            <>
              <PrevBtn
                btnType="black"
                disabled={isPrevBtnDisabled || mainSwiper?.isBeginning}
                iconType="previous"
                noLabel
                onClick={() => {
                  mainSwiper?.slidePrev();
                  thumbsSwiper?.slidePrev();
                  handleChangeSlide();
                }}
              />
              <NextBtn
                btnType="yellow"
                disabled={isNextBtnDisabled || mainSwiper?.isEnd}
                iconType="next"
                noLabel
                onClick={() => {
                  mainSwiper?.slideNext();
                  thumbsSwiper?.slideNext();
                  handleChangeSlide();
                }}
              />
            </>
          )}
          {images?.map((file) => (
            <SwiperSlide key={file.id}>
              <MainSwiperSlideContent imgSrc={file.picture} />
            </SwiperSlide>
          ))}
        </MainSwiper>
      </MainSwiperContainer>
      <ThumbSwiperContainer item lg={2} xs={12}>
        <ThumbSwiper
          autoHeight
          direction={isDesktop ? "vertical" : "horizontal"}
          modules={[Mousewheel, Thumbs]}
          mousewheel={true}
          observeParents
          slidesPerView="auto"
          spaceBetween={isDesktop ? 13 : 15}
          onSlideChange={() => handleChangeSlide()}
          onSwiper={(swiper) => setThumbsSwiper(swiper)}
        >
          {images?.map((file, idx) => (
            <SwiperSlide key={file.id} virtualIndex={idx}>
              <ThumbSlideContainer imgSrc={file.picture} />
              <ActiveIdentifier className="thumb_identifier" />
            </SwiperSlide>
          ))}
        </ThumbSwiper>
      </ThumbSwiperContainer>
    </GalleryContainer>
  );
};

export default PatternCarousel;
