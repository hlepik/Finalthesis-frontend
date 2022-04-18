import { Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import _ from "lodash";
import { FC } from "react";

import { COLOR_BLACK, COLOR_GOLD } from "../utils/constants";

type IconType =
  | "close"
  | "next"
  | "previous"
  | "tick"
  | "send"
  | "add"
  | "delete"
  | "remove";

type BtnType =
  | "yellow"
  | "black"
  | "transparent"
  | "gray"
  | "borderGray"
  | "borderRed"
  | "red";

interface IOutlinedBtn extends ButtonProps {
  label?: string;
  iconType?: IconType;
  noLabel?: boolean;
  btnType: BtnType;
  paddingSide?: number;
}

const getBtnSvgIconByType = (
  iconType: IconType,
  color: string,
  icon: IIcon
) => {
  const { height, width, viewBox } = icon;
  const paths = {
    close: (
      <>
        <path
          d="M16.5 1.5L1.5 16.5"
          stroke={color}
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <path
          d="M16.5 16.5L1.5 1.5"
          stroke={color}
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </>
    ),

    next: (
      <path
        clipRule="evenodd"
        d="M7.58574 9.00008L0.292847 1.70718L1.70706 0.292969L9.70706 8.29297C10.0976 8.68349 10.0976 9.31666 9.70706 9.70718L1.70706 17.7072L0.292847 16.293L7.58574 9.00008Z"
        fill={color}
        fillRule="evenodd"
      />
    ),
    tick: (
      <path
        d="M16.5 1L6.99999 16L0.999988 11"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth="2"
        xmlns="http://www.w3.org/2000/svg"
      />
    ),
    send: (
      <path
        clipRule="evenodd"
        d="M0.103287 2.62631C-0.447563 0.940833 1.30931 -0.57761 2.89914 0.217304L16.951 7.24321C17.6868 7.61114 18.0553 8.31962 18.0565 9.02864M14.0559 10.0324L2.00471 16.058L2.00827 16.0473L3.86392 10.0324H14.0559ZM18.0565 9.03238C18.0564 9.74244 17.6879 10.4524 16.9509 10.8209L2.89914 17.8468C1.3093 18.6417 -0.447575 17.1233 0.103295 15.4378L2.07942 9.03236L0.103287 2.62631M3.86394 8.03238H14.0572L2.00472 2.00616L2.00828 2.01684L3.86394 8.03238Z"
        fill={color}
        fillRule="evenodd"
        xmlns="http://www.w3.org/2000/svg"
      />
    ),
    add: (
      <>
        <path
          d="M12 3V21"
          stroke={color}
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <path
          d="M3 12H21"
          stroke={color}
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </>
    ),
    remove: (
      <>
        <path
          d="M0 1H18"
          stroke={color}
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </>
    ),
    delete: (
      <>
        <path
          d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
          stroke={color}
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </>
    ),
  };

  const path =
    !!iconType && !_.isEmpty(iconType) && _.has(paths, iconType)
      ? _.get(paths, iconType)
      : null;

  return (
    <svg fill="none" height={height} viewBox={viewBox} width={width}>
      {path}
    </svg>
  );
};

const StyledBtn = styled(Button, {
  shouldForwardProp: (prop) =>
    prop !== "noLabel" &&
    prop !== "btnType" &&
    prop !== "rotate" &&
    prop !== "paddingSide",
})<{
  noLabel?: boolean;
  btnType: IBtnType;
  rotate?: boolean;
  paddingSide?: number;
}>(({ noLabel, btnType, rotate, paddingSide }) => ({
  fontFamily: "Montserrat",
  fontSize: "1rem",
  border: btnType.border,
  color: btnType.color,
  backgroundColor: btnType.backgroundColor,
  textAlign: "center",
  borderRadius: "40px",
  padding: noLabel
    ? 0
    : `16px ${_.isNumber(paddingSide) ? `${paddingSide}px` : "32px"}`,
  height: "3rem",
  width: "auto",
  "&:hover": {
    backgroundColor: btnType.backgroundColor,
  },
  minWidth: noLabel ? "40px" : "unset",
  transform: rotate ? "rotate(180deg)" : "unset",
  "& div": {
    transform: rotate ? "rotate(180deg)" : "unset",
  },
}));

interface IIcon {
  height: string;
  width: string;
  viewBox: string;
  isLeftSide: boolean;
}

const iconTypes: {
  close: IIcon;
  next: IIcon;
  tick: IIcon;
  send: IIcon;
  add: IIcon;
  remove: IIcon;
  delete: IIcon;
} = {
  close: {
    height: "15",
    width: "15",
    viewBox: "0 0 18 18",
    isLeftSide: false,
  },
  next: {
    height: "21",
    width: "21",
    viewBox: "0 0 7 19",
    isLeftSide: false,
  },
  tick: {
    height: "15.5",
    width: "15",
    viewBox: "0 0 18 17",
    isLeftSide: false,
  },
  send: {
    height: "19",
    width: "19",
    viewBox: "0 0 19 19",
    isLeftSide: false,
  },
  add: {
    height: "24",
    width: "24",
    viewBox: "0 0 24 24",
    isLeftSide: false,
  },
  remove: {
    height: "2",
    width: "18",
    viewBox: "0 0 18 2",
    isLeftSide: false,
  },
  delete: {
    height: "24",
    width: "24",
    viewBox: "0 0 24 24",
    isLeftSide: false,
  },
};

export interface IBtnType {
  backgroundColor: string;
  color: string;
  border: string;
}

const btnTypes: {
  black: IBtnType;
  yellow: IBtnType;
  transparent: IBtnType;
  gray: IBtnType;
  borderGray: IBtnType;
  red: IBtnType;
  borderRed: IBtnType;
} = {
  yellow: {
    backgroundColor: COLOR_GOLD,
    color: "white",
    border: `4px solid ${COLOR_GOLD}`,
  },

  black: {
    backgroundColor: COLOR_BLACK,
    color: COLOR_GOLD,
    border: `4px solid ${COLOR_GOLD}`,
  },
  transparent: {
    backgroundColor: "transparent",
    color: COLOR_GOLD,
    border: "none",
  },
  gray: {
    backgroundColor: "transparent",
    color: "#CCCBCA",
    border: "none",
  },
  borderGray: {
    backgroundColor: "darkgray",
    color: "#CCCBCA",
    border: "4px solid #CCCBCA",
  },
  red: {
    backgroundColor: "#ef5350",
    color: "rgb(253, 237, 237)",
    border: "4px solid rgb(253, 237, 237)",
  },
  borderRed: {
    backgroundColor: "transparent",
    color: "#ef5350",
    border: "none",
  },
};

const BasicButton: FC<IOutlinedBtn> = ({
  label = "",
  btnType,
  iconType,
  noLabel,
  paddingSide,
  ...rest
}) => {
  const getCorrectBtnType = (btnTypeName: BtnType) => {
    if (
      !!btnTypeName &&
      !_.isEmpty(btnTypeName) &&
      _.has(btnTypes, btnTypeName)
    ) {
      return _.get(btnTypes, btnTypeName) as IBtnType;
    }
    return btnTypes.black;
  };
  const iconT = iconType === "previous" ? "next" : iconType;

  const getContent = (
    btnType: BtnType,
    label: string,
    iconType?: IconType,
    noLabel?: boolean
  ) => {
    const correctBtnType = getCorrectBtnType(btnType);
    if (!!iconType && !_.isEmpty(iconType) && _.has(iconTypes, iconType)) {
      const iconParams = _.get(iconTypes, iconType) as IIcon;
      const icon = getBtnSvgIconByType(
        iconType,
        correctBtnType.color,
        iconParams
      );
      if (noLabel) return icon;
      return (
        <>
          {iconParams?.isLeftSide ? icon : null}
          {label ? <div>{label}</div> : null}
          {!iconParams?.isLeftSide ? icon : null}
        </>
      );
    } else {
      return label;
    }
  };

  return (
    <StyledBtn
      btnType={getCorrectBtnType(btnType)}
      noLabel={_.isEmpty(label)}
      rotate={iconType === "previous"}
      paddingSide={paddingSide}
      {...rest}
    >
      {getContent(btnType, label, iconT, noLabel)}
    </StyledBtn>
  );
};

export default BasicButton;
