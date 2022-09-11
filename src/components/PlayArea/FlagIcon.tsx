import React from "react";
import flag from "../../assets/flag.png";
import { iconWidth, iconHeight } from "../../constants";

interface IProps {
  dataCoord: string;
}

const FlagIcon: React.FC<IProps> = ({ dataCoord }) => (
  <img
    src={flag}
    alt="flag"
    data-coord={dataCoord}
    width={iconWidth}
    height={iconHeight}
  />
);

export default FlagIcon;
