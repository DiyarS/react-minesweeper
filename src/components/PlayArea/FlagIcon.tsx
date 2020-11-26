import React from "react";
import flag from "../../assets/flag.png";
import { iconSize } from "../../constants";

interface IProps {
  dataCoord: string;
}

const FlagIcon: React.FC<IProps> = ({ dataCoord }) => (
  <img
    src={flag}
    alt="flag"
    data-coord={dataCoord}
    width={iconSize}
    height={iconSize}
  />
);

export default FlagIcon;
