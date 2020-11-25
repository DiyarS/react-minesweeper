import React from "react";
import default_mine_icon from "../../assets/mine_default.png";
import unarmed_mine_icon from "../../assets/mine_unarmed.png";
import red_mine_icon from "../../assets/mine_red.png";
import { iconSize } from "../../constants";

export const MineTypes = {
  default: "0",
  unarmed: "1",
  blown: "2",
};

const MineIconsMappings = {
  [MineTypes.default]: default_mine_icon,
  [MineTypes.unarmed]: unarmed_mine_icon,
  [MineTypes.blown]: red_mine_icon,
};

interface IProps {
  type: string;
}

const MineIcon: React.FC<IProps> = ({ type = MineTypes.default }) => {
  const icon = MineIconsMappings[type];
  return <img src={icon} alt="oops" width={iconSize} height={iconSize} />;
};

export default MineIcon;
