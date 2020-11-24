import React, { useState, useEffect, useRef } from "react";
import isEqual from "lodash.isequal";
import Header from "../Header";
import GameConfigModal from "../GameConfigModal";
import { IGameConfig } from "../../interfaces";
import "./App.css";
import PlayArea from "../PlayArea";

function App() {
  const [gameConfig, setGameConfig] = useState<IGameConfig>({
    rowsCount: 5,
    columnsCount: 5,
    minesCount: 10,
  });
  const prevGameConfig = useRef<IGameConfig>();

  useEffect(() => {
    if (
      prevGameConfig.current &&
      !isEqual(gameConfig, prevGameConfig.current)
    ) {
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
      <PlayArea config={gameConfig} />
      <GameConfigModal onSubmit={setGameConfig} />
    </div>
  );
}

export default App;
