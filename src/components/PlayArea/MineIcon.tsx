import React from "react";
import default_mine_icon from "../../assets/mine_default.png";
import unarmed_mine_icon from "../../assets/mine_unarmed.png";
import red_mine_icon from "../../assets/mine_red.png";

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
  return (
    <img
      className="mine-cell"
      src={icon}
      alt="oops"
      width="40px"
      height="40px"
    />
  );
};

export default MineIcon;
