import React from "react";
import flag from "../../assets/flag.png";
import { iconSize } from "../../constants";

const FlagIcon: React.FC = () => (
  <img src={flag} alt="flag" width={iconSize} height={iconSize} />
);

export default FlagIcon;
