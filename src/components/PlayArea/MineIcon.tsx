import React from "react";
import default_mine_icon from "../../assets/mine_default.png";
import red_mine_icon from "../../assets/mine_red.png";

interface IProps {
  type: string;
}

const imgSize = "40px";

const MineIcon: React.FC<IProps> = ({ type = "default" }) => (
  <img src={default_mine_icon} alt="oops" width={imgSize} height={imgSize} />
);

export default MineIcon;
