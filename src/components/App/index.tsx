import React, { useState, useEffect, useRef } from "react";
import isEqual from "lodash.isequal";
import { Card } from "antd";
import Header from "../Header";
import GameConfigModal from "../GameConfigModal";
import { IGameConfig } from "../../interfaces";
import "./App.css";
import PlayArea from "../PlayArea";

const defaultConfig = {
  rowsCount: 10,
  columnsCount: 10,
  minesCount: 10,
};

function App() {
  const [isGameOver, setGameOver] = useState(false);
  const [gameConfig, setGameConfig] = useState<IGameConfig>(defaultConfig);
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
    if (isGameOver) setGameConfig(defaultConfig);
  }, [isGameOver]);

  useEffect(() => {
    prevGameConfig.current = gameConfig;
  });

  function resetGame() {
    setGameOver(false);
  }

  const isConfigDefault = isEqual(gameConfig, defaultConfig);

  return (
    <div className="App">
      <Card className="App-inner-container">
        <Header isGameOver={isGameOver} reset={resetGame} />
        <PlayArea
          isGameOver={isGameOver}
          setGameOver={setGameOver}
          config={gameConfig}
        />
        <GameConfigModal
          isConfigDefault={isConfigDefault}
          onSubmit={setGameConfig}
        />
      </Card>
    </div>
  );
}

export default App;
