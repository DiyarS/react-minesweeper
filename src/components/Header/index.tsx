import React from "react";
import { HeaderWrapper } from "./styles";
import sad_icon from "../../assets/sad.png";
import happy_icon from "../../assets/happy.png";
import { iconSize } from "../../constants";

interface IProps {
  isGameOver: boolean;
  reset: () => void;
}

const Header: React.FC<IProps> = ({ isGameOver, reset }) => {
  return (
    <HeaderWrapper>
      <img
        src={isGameOver ? sad_icon : happy_icon}
        alt="smile"
        onClick={reset}
        width={iconSize}
        height={iconSize}
      />
    </HeaderWrapper>
  );
};

export default Header;
