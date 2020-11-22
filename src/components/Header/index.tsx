import React from "react";

interface IProps {
  reset: () => void;
}

const Header: React.FC<IProps> = ({ reset }) => {
  return (
    <div>
      <div onClick={reset}>Reset</div>
    </div>
  );
};

export default Header;
