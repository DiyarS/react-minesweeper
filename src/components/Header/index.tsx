import React from "react";
import { Card } from "antd";
import { FlagsCounter, ResetIcon } from "./styles";
import sad_icon from "../../assets/sad.png";
import happy_icon from "../../assets/happy.png";
import { iconSize } from "../../constants";

interface IProps {
  flagsCount: number;
  isGameOver: boolean;
  isWon: boolean;
  reset: () => void;
}

const Header: React.FC<IProps> = ({ flagsCount, isWon, isGameOver, reset }) => {
  return (
    <Card>
      <FlagsCounter>Flags remaining: {flagsCount}</FlagsCounter>
      <ResetIcon
        src={isGameOver && !isWon ? sad_icon : happy_icon}
        alt="smile"
        onClick={reset}
        width={iconSize}
        height={iconSize}
      />
    </Card>
  );
};

export default Header;
