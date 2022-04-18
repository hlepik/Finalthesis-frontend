import { FC, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { Box, Card, CardMedia, Grid, styled, Typography } from "@mui/material";
import { Link } from "react-router-dom";

interface PatternCard {
  title: string;
  picture: string;
  id: string | undefined;
}

const StyledText = styled(Typography)({
  margin: "0.5rem",
  color: "white",
});

const PatternCard: FC<PatternCard> = ({ title, picture, id }) => {
  return (
    <Link to={"userPattern/" + id}>
      <div className="PictureCard">
        <img src={picture} className="Image" alt={title} />

        <div className="TitleGrid">
          <StyledText variant="h4">{title}</StyledText>
        </div>
      </div>
    </Link>
  );
};
export default PatternCard;
