import React, { useState, useEffect, useRef } from "react";
import isEqual from "lodash.isequal";
import Header from "../Header";
import GameConfigModal from "../GameConfigModal";
import { IGameConfig } from "../../interfaces";
import "./App.css";

function App() {
  const [gameConfig, setGameConfig] = useState<IGameConfig>({
    rowsCount: 0,
    columnsCount: 0,
    minesCount: 0,
  });
  const prevGameConfig = useRef<IGameConfig>();

  useEffect(() => {
    if (
      prevGameConfig.current &&
      !isEqual(gameConfig, prevGameConfig.current)
    ) {
      console.log(gameConfig, prevGameConfig.current);
      console.log("Changed");
    }
  });

  useEffect(() => {
    prevGameConfig.current = gameConfig;
  });

  function resetGame() {
    console.log("Reset called");
  }

  return (
    <div className="App">
      <Header reset={resetGame} />
      <GameConfigModal onSubmit={setGameConfig} />
    </div>
  );
}

export default App;
