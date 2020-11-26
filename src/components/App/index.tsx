import React, { useState, useEffect, useRef } from "react";
import isEqual from "lodash.isequal";
import { Card, message } from "antd";
import Header from "../Header";
import GameConfigModal from "../GameConfigModal";
import { IGameConfig } from "../../interfaces";
import "./App.css";
import PlayArea from "../PlayArea";

const defaultConfig = {
  rowsCount: 0,
  columnsCount: 0,
  minesCount: 0,
};

function App() {
  const [isGameOver, setGameOver] = useState(false);
  const [gameConfig, setGameConfig] = useState<IGameConfig>(defaultConfig);
  const prevGameConfig = useRef<IGameConfig>();
  const [flagsCount, setFlagsCount] = useState(gameConfig.minesCount);
  const [showCongratz, setShowCongratz] = useState(false);

  useEffect(() => {
    if (
      prevGameConfig.current &&
      !isEqual(gameConfig, prevGameConfig.current)
    ) {
      setFlagsCount(gameConfig.minesCount);
    }
  }, [gameConfig]);

  useEffect(() => {
    showCongratz && message.success("You won!!!") && setGameOver(true);
  }, [showCongratz]);

  useEffect(() => {
    prevGameConfig.current = gameConfig;
  });

  function resetGame() {
    setGameOver(false);
    setShowCongratz(false);
  }

  const isConfigDefault = isEqual(gameConfig, defaultConfig);

  return (
    <div className="App">
      <Card className="App-inner-container">
        <Header
          flagsCount={flagsCount}
          isGameOver={isGameOver}
          isWon={showCongratz}
          reset={resetGame}
        />
        <PlayArea
          isGameOver={isGameOver}
          setGameOver={setGameOver}
          config={gameConfig}
          flagsCount={flagsCount}
          _setFlagsCount={setFlagsCount}
          setShowCongratz={setShowCongratz}
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
