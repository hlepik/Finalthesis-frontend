import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { IUserPattern } from "../../dto/IUserPattern";
import { EDialogType } from "../../types/EDialogType";
import { Controller, useForm } from "react-hook-form";
import { IUnit } from "../../dto/IUnit";
import { BaseService } from "../../service/base-service";
import { Grid, styled, TextField, Typography } from "@mui/material";
import { IInstruction } from "../../dto/IInstruction";
import { ICategory } from "../../dto/ICategory";
import BasicButton from "../../components/BasicButton";
import { PicturePath } from "../../configuration";
import { COLOR_GOLD, COLOR_GRAY } from "../../utils/constants";
import { Link, useNavigate } from "react-router-dom";

const RowGrid = styled(Grid)({
    display: "flex",
    flexDirection: "row",
    width: "100%",
});
const TextGrid = styled(Grid)({
    marginLeft: "2rem",
    marginTop: "1rem",
    marginRight: "4rem",
    width: "100%",
    height: "350px",
    display: "flex",
    flexDirection: "column",
});
const ColumnGrid = styled(Grid)({
    display: "flex",
    flexDirection: "column",
    marginLeft: "2rem",
    marginRight: "2rem",
});
const InstructionGrid = styled(Grid)({
    display: "flex",
    flexDirection: "row",
    marginBottom: "2rem",
    width: "100%",
});
const MainContainer = styled(Grid)({
    width: "100%",
});
const BottomGrid = styled(Grid)({
    marginTop: "auto",
});
const InputGrid = styled(Grid)({
    width: "350px",
    marginBottom: "2rem",
    marginLeft: "auto",
    marginRight: "3rem",
});
const StyledText = styled(Typography)({
    fontSize: "1.5rem",
    lineHeight: "2rem",
    fontWeight: 400,
    marginTop: "1.5rem",
});
const StyledTextField = styled(TextField)({
    borderRadius: "30px 30px 30px",
    "& input": {
        padding: 0,
    },
});
const SearchButton = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    position: "relative",
    backgroundColor: "#F6F6F6",
    borderRadius: "40px",
    height: "46px",
    flexGrow: 1,
    "& .MuiFormControl-root": {
        flexGrow: 1,
        justifyContent: "center",
    },
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            border: 0,
            paddingLeft: "24px",
            paddingRight: "24px",
        },
        "& input": {
            border: 0,
            padding: 0,
            paddingLeft: "24px",
            paddingRight: "24px",
            "&::placeholder": {
                opacity: 0.5,
                fontWeight: 600,
                fontSize: "16px",
                lineHeight: "20px",
                fontStyle: "normal",
            },
            "&:-ms-input-placeholder": {
                opacity: 0.5,
            },
            "&::-ms-input-placeholder": {
                opacity: 0.5,
            },
        },
    },
}));
const StyledForm = styled("form")({
    width: "100%",
});
const StyledButton = styled(BasicButton)({
    border: `3px solid ${COLOR_GOLD}`,
    height: "47px",
});
const StyledImage = styled("div")({
    position: "relative",
    maxWidth: "290px",
    width: "100%",
    padding: "1rem",
    backgroundColor: "rgba(247, 216, 123, 0.4)",
    height: "450px",
    borderBottomRightRadius: "30% 20%",
    borderTopLeftRadius: "30% 20%",
});
const StyledBasicButton = styled(BasicButton, {
    shouldForwardProp: (prop) => prop !== "clicked",
})<{ clicked: boolean }>(({ clicked }) => ({
    backgroundColor: clicked ? "rgba(247, 216, 123, 0.4)" : "none",
    "&:hover": {
        backgroundColor: clicked ? "rgba(247, 216, 123, 0.4)" : "none",
    },
}));
interface ISearchInput {
    search: string;
}

const PatternIndex = () => {
    const appState = useContext(AppContext);
    const navigate = useNavigate();
    const [pattern, setPattern] = useState<IInstruction[]>([] as IInstruction[]);
    const [categories, setCategories] = useState([] as ICategory[]);
    const [hasClicked, setHasClicked] = useState("Kõik");
    const [categoryId, setCategoryId] = useState("00000000-0000-0000-0000-000000000000");

    const { handleSubmit, control } = useForm<ISearchInput>({
        defaultValues: { search: "" },
    });
    const [searchResult, setSearchResult] = useState<IInstruction[]>([] as IInstruction[]);

    const handleSearchInput = async (data: ISearchInput) => {
        if (data.search === "") {
            if (hasClicked === "Kõik") {
                setSearchResult(pattern);
            } else {
                let response = await BaseService.getAll<IInstruction>(
                    "/Instructions/category/" + categoryId,
                    appState.token!
                );

                if (response.ok && response.data) {
                    setSearchResult(response.data);
                }
            }
        } else {
            let response = await BaseService.getAll<IInstruction>(
                "/Instructions/search/" + data.search + "/" + categoryId,
                appState.token!
            );

            if (response.ok && response.data) {
                setSearchResult(response.data);
            }
        }
    };

    const loadData = useCallback(async () => {
        let response = await BaseService.getAll<ICategory>("/Categories", appState.token!);

        if (response.ok && response.data) {
            setCategories(response.data);
        }
        let result = await BaseService.getAll<IInstruction>("/Instructions", appState.token!);

        if (result.ok && result.data) {
            setPattern(result.data);
            setSearchResult(result.data);
        }
    }, [appState]);

    const handleCategoryChange = async (category: ICategory) => {
        setHasClicked(category.name);
        setCategoryId(category.id!);
        let response = await BaseService.getAll<IInstruction>("/Instructions/category/" + category.id, appState.token!);

        if (response.ok && response.data) {
            setSearchResult(response.data);
        } else {
            console.log("error");
        }
    };
    const getAllCategories = () => {
        setHasClicked("Kõik");
        setCategoryId("00000000-0000-0000-0000-000000000000");
        setSearchResult(pattern);
    };

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <Grid container className={"PageContainer"}>
            <RowGrid>
                <ColumnGrid>
                    <StyledBasicButton
                        clicked={hasClicked === "Kõik"}
                        btnType={"transparent"}
                        label={"Kõik"}
                        onClick={getAllCategories}
                    />
                    {categories.map((category: ICategory) => (
                        <StyledBasicButton
                            key={category.id}
                            clicked={hasClicked === category.name}
                            btnType={"transparent"}
                            label={category.name}
                            onClick={() => handleCategoryChange(category)}
                        />
                    ))}
                </ColumnGrid>
                <MainContainer>
                    <InputGrid>
                        <form onSubmit={handleSubmit(handleSearchInput)}>
                            <SearchButton>
                                <Controller
                                    control={control}
                                    name="search"
                                    render={({ field: { onChange, value } }) => (
                                        <StyledTextField
                                            name="search"
                                            placeholder={"Sisesta otsingusõna"}
                                            onChange={onChange}
                                            value={value}
                                        />
                                    )}
                                />

                                <StyledButton btnType={"yellow"} label={"Otsi"} type={"submit"} />
                            </SearchButton>
                        </form>
                    </InputGrid>
                    {searchResult.map((result: IInstruction) => (
                        <InstructionGrid key={result.id}>
                            <StyledImage>
                                <img src={`${PicturePath}${result.mainPictureName}`} className="Image" />
                            </StyledImage>
                            <TextGrid>
                                <Typography variant={"h3"}> {result.name}</Typography>
                                <StyledText variant={"body1"}> {result.description}</StyledText>
                                <BottomGrid>
                                    <BasicButton
                                        btnType={"yellow"}
                                        label={"Vaata lähemalt"}
                                        onClick={() => navigate("../userPattern/" + result.id)}
                                    />
                                </BottomGrid>
                            </TextGrid>
                        </InstructionGrid>
                    ))}
                </MainContainer>
            </RowGrid>
        </Grid>
    );
};

export default PatternIndex;
