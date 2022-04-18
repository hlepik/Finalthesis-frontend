import { Grid, styled, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { COLOR_GRAY } from "../utils/constants";

const StyledTitle = styled(Typography)({
  color: COLOR_GRAY,
  fontSize: "1rem",
});
const StyledText = styled(Typography)({
  color: COLOR_GRAY,
  fontSize: "0.75rem",
  fontWeight: 400,
});
const RowGrid = styled(Grid)({
  display: "flex",
  paddingTop: "1rem",
  flexDirection: "row",
  columnGap: "6rem",
  justifyContent: "center",
});
const Footer = () => {
  return (
    <footer id="footer">
      <RowGrid>
        <Grid>
          <StyledTitle variant={"h5"}>Kontaktandmed</StyledTitle>
          <StyledText variant={"h5"}>Email: helenlepiku@gmail.com</StyledText>
          <StyledText variant={"h5"}>Telefon: 1234567</StyledText>
        </Grid>
        <Grid>
          <StyledTitle variant={"h5"}>Firmast</StyledTitle>
          <Link to={"/aboutUs"}>
            <StyledText variant={"h5"}>Meist</StyledText>
          </Link>
        </Grid>
        <Grid>
          <StyledTitle variant={"h5"}>Sotsiaalmeedia</StyledTitle>
          <StyledText variant={"h5"}>Tulemas...</StyledText>
        </Grid>
      </RowGrid>
    </footer>
  );
};

export default Footer;
