import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Avatar, Fab, styled } from "@mui/material";
import { FC } from "react";
import SortableList, { SortableItem } from "react-easy-sort";
import { IFile } from "../dto/IFile";
import { arrayMove } from "react-sortable-hoc";
import { IPicture } from "../dto/IPicture";
const StyledSortableList = styled(SortableList)(() => ({
  display: "flex",
  flexWrap: "wrap",
  userSelect: "none",
  gap: "16px",
}));

const ItemContainer = styled("div")(() => ({
  position: "relative",
  flexShrink: 0,
  display: "flex",
  userSelect: "none",
  borderRadius: "100%",
}));

const StyledImage = styled(Avatar)(() => ({
  width: 150,
  height: 150,
  cursor: "grab !important",
  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
}));

const DeleteFab = styled(Fab)(() => ({
  position: "absolute",
  bottom: 0,
  right: 0,
  opacity: 0.5,
  "&:hover": {
    opacity: 1,
  },
}));

const MainFab = styled(Fab)(() => ({
  position: "absolute",
  color: "#eec836",
  bottom: 0,
  left: 0,
  opacity: 0.5,
  "&:hover": {
    opacity: 1,
  },
}));

const CheckedIcon = styled(StarIcon)(() => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  color: "#eec836",
}));

export interface ISortableGallery {
  items: IPicture[];
  onChange: (items: IPicture[]) => void;
  onDelete: (id?: string) => void;
}

const SortableGallery: FC<ISortableGallery> = ({
  items,
  onChange,
  onDelete,
}) => {
  const onSortEnd = (oldIndex: number, newIndex: number) => {
    let sortedItems: any;
    sortedItems = arrayMove(items, oldIndex, newIndex).map(
      (item: IPicture, i: number) => ({
        ...item,
        priority: i,
      })
    );
    onChange(sortedItems);
  };

  const onSetFirst = (index: number) => {
    onSortEnd(index, 0);
  };

  return (
    <StyledSortableList onSortEnd={onSortEnd}>
      {items
        .sort((p, n) => p.priority - n.priority)
        .map(({ id, url, name }, idx) => (
          <SortableItem key={id}>
            <ItemContainer>
              <StyledImage
                alt={name}
                imgProps={{ draggable: false }}
                src={url}
                variant="square"
              />
              {idx !== 0 ? (
                <MainFab
                  aria-label="make first"
                  size="small"
                  onClick={() => onSetFirst(idx)}
                >
                  <StarBorderIcon />
                </MainFab>
              ) : (
                <CheckedIcon fontSize="large" />
              )}
              <DeleteFab
                aria-label="delete"
                color="error"
                size="small"
                onClick={() => onDelete(id)}
              >
                <DeleteForeverIcon />
              </DeleteFab>
            </ItemContainer>
          </SortableItem>
        ))}
    </StyledSortableList>
  );
};

export default SortableGallery;
