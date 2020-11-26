import React, { useEffect, useState, useRef } from "react";
import { IGameConfig } from "../../interfaces";
import MineIcon from "./MineIcon";
import FlagIcon from "./FlagIcon";
import { AreaWrapper, Row, CellWrapper } from "./styles";
import { MineTypes } from "./MineIcon";
import { uuid } from "../../utils";

interface IProps {
  config: IGameConfig;
  isGameOver: boolean;
  setGameOver: (isGameOver: boolean) => void;
  _setFlagsCount: (count: number) => void;
  setShowCongratz: (isWon: boolean) => void;
  flagsCount: number;
}

type Coordinate = {
  x: number;
  y: number;
  type?: string;
  neighbourMinesCount?: number;
  show?: boolean;
  flagged?: boolean;
};

type CoordinatesDict = { [key: string]: any };

enum CellTypes {
  Empty = "empty",
  Mine = "mine",
  Number = "number",
}

function getRandomArbitrary(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

const PlayArea: React.FC<IProps> = ({
  config,
  isGameOver,
  setGameOver,
  flagsCount,
  _setFlagsCount,
  setShowCongratz,
}) => {
  const { rowsCount, columnsCount, minesCount } = config;
  const [allCoordinates, _setAllCoordinates] = useState<CoordinatesDict>({});
  const prevAllCoordinates = useRef<CoordinatesDict>();
  const currAllCoordinates = useRef<CoordinatesDict>(allCoordinates); // for event listener not capturing actual state
  const currFlagsCount = useRef(flagsCount); // for event listener not capturing actual state
  const prevIsGameOver = useRef<boolean>();

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    rowsCount && columnsCount && minesCount && startRound();
  }, [rowsCount, columnsCount, minesCount]);

  useEffect(() => {
    calcFlaggedCells();
  }, [allCoordinates]);

  useEffect(() => {
    if (flagsCount === 0 && Object.keys(allCoordinates).length) checkIfWon();
  }, [flagsCount]);

  useEffect(() => {
    if (isGameOver) revealAllMines();

    if (!isGameOver && prevIsGameOver.current) startRound();
  }, [isGameOver]);

  useEffect(() => {
    prevAllCoordinates.current = allCoordinates;
    prevIsGameOver.current = isGameOver;
  });

  useEffect(() => {
    document.addEventListener("contextmenu", (e) => handleCellFlag(e));
  }, []);

  function setAllCoordinates(coordinates: CoordinatesDict) {
    currAllCoordinates.current = coordinates;
    _setAllCoordinates(coordinates);
  }

  function setFlagsCount(count: number) {
    currFlagsCount.current = count;
    _setFlagsCount(count);
  }

  function checkIfWon() {
    let isWon = true;

    for (const key in allCoordinates) {
      const cell = allCoordinates[key];

      if (!cell.show || (cell.type === CellTypes.Mine && !cell.flagged)) {
        isWon = false;
        break;
      }
    }
    if (isWon) setShowCongratz(true);
  }

  function revealAllMines() {
    const coordinates = Object.assign({}, allCoordinates);

    for (let key in coordinates) {
      if (coordinates[key].type === CellTypes.Mine)
        coordinates[key].show = true;
    }

    setAllCoordinates(coordinates);
  }

  function calcFlaggedCells() {
    let flaggedCellsNumber = 0;

    for (const key in allCoordinates) {
      if (allCoordinates[key].flagged) flaggedCellsNumber++;
    }

    setFlagsCount(config.minesCount - flaggedCellsNumber);
  }

  const handleCellFlag = (event: MouseEvent) => {
    event.preventDefault();

    const target = event.target as HTMLElement;
    const cellKey = target!.getAttribute("data-coord");
    const coordinates = Object.assign({}, currAllCoordinates.current);

    if (cellKey && coordinates[cellKey]) {
      const cell = coordinates[cellKey];

      if (cell.flagged) {
        cell.flagged = !cell.flagged;
        cell.show = !!!cell.show;
      } else {
        if (currFlagsCount.current > 0) {
          cell.flagged = !!!cell.flagged;
          cell.show = !!!cell.show;
        }
      }

      setAllCoordinates(coordinates);
    }
  };

  function parseCoordToKey(coordinate: Coordinate): string {
    return `${coordinate.x}-${coordinate.y}`;
  }

  function startRound() {
    const coordinates: CoordinatesDict = {};

    setupMines(coordinates);
    calcNeighbourMines(coordinates);

    setAllCoordinates(coordinates);
  }

  function setupMines(coordinates: CoordinatesDict) {
    const minesCoordinates: CoordinatesDict = generateMinesCoordinates();

    for (let c = 0; c < columnsCount; c++) {
      for (let r = 0; r < rowsCount; r++) {
        const coordinate: Coordinate = {
          x: c,
          y: r,
          type: CellTypes.Empty,
          flagged: false,
        };
        const coordinateAsKey = parseCoordToKey(coordinate);
        if (minesCoordinates[coordinateAsKey]) coordinate.type = CellTypes.Mine;

        coordinates[coordinateAsKey] = coordinate;
      }
    }
  }

  function calcNeighbourMines(coordinates: CoordinatesDict) {
    for (const coordKey in coordinates) {
      const centralCoord: Coordinate = coordinates[coordKey];
      if (centralCoord.type !== CellTypes.Mine) {
        let neighbourMinesCount = 0;

        for (let x = centralCoord.x - 1; x <= centralCoord.x + 1; x++) {
          for (let y = centralCoord.y - 1; y <= centralCoord.y + 1; y++) {
            const coordAsKey: string = parseCoordToKey({ x, y });
            const neighbourCoord: Coordinate = coordinates[coordAsKey];

            if (neighbourCoord && neighbourCoord.type === CellTypes.Mine)
              neighbourMinesCount++;
          }
        }

        if (neighbourMinesCount > 0) {
          centralCoord.neighbourMinesCount = neighbourMinesCount;
          centralCoord.type = CellTypes.Number;
        }
      }
    }
  }

  function handleCellClick(cell: Coordinate) {
    if (cell.type === CellTypes.Mine) {
      setGameOver(true);
    } else {
      const coordinates = Object.assign({}, allCoordinates);
      const coordAsKey: string = parseCoordToKey(cell);
      coordinates[coordAsKey].show = true;

      if (coordinates[coordAsKey].type === CellTypes.Empty)
        checkEmptyNeighbours(coordinates[coordAsKey], coordinates);

      setAllCoordinates(coordinates);
    }
  }

  function checkEmptyNeighbours(
    cell: Coordinate,
    coordinates: CoordinatesDict
  ) {
    const cellCoordsSum = Math.abs(cell.x + cell.y);

    for (let x = cell.x - 1; x <= cell.x + 1; x++) {
      for (let y = cell.y - 1; y <= cell.y + 1; y++) {
        if (x !== cell.x || y !== cell.y) {
          const coordAsKey: string = parseCoordToKey({ x, y });
          const cellToCheck = coordinates[coordAsKey];

          if (cellToCheck) {
            const neightbourCoordsSum = Math.abs(cellToCheck.x + cellToCheck.y);
            const coordsSumsDifference = Math.abs(
              cellCoordsSum - neightbourCoordsSum
            );

            if (cellToCheck && cellToCheck.type === CellTypes.Number) {
              cellToCheck.show = true;
            } else if (
              cellToCheck &&
              cellToCheck.type === CellTypes.Empty &&
              !cellToCheck.show &&
              coordsSumsDifference < 2 &&
              neightbourCoordsSum !== cellCoordsSum
            ) {
              cellToCheck.show = true;
              checkEmptyNeighbours(cellToCheck, coordinates);
            }
          }
        }
      }
    }
  }

  function generateMinesCoordinates() {
    const coordinates: CoordinatesDict = {};

    const getRandomCoord = () => ({
      x: getRandomArbitrary(0, columnsCount - 1),
      y: getRandomArbitrary(0, rowsCount - 1),
    });

    for (let i = 0; i < minesCount; i++) {
      let newCoord: Coordinate = getRandomCoord();
      let key = parseCoordToKey(newCoord);

      while (coordinates[key]) {
        newCoord = getRandomCoord();
        key = parseCoordToKey(newCoord);
      }

      coordinates[key] = newCoord;
    }

    return coordinates;
  }

  function flaggedCellRender(cell: Coordinate) {
    if (isGameOver && cell.type === CellTypes.Mine)
      return <MineIcon type={MineTypes.unarmed} />;

    return <FlagIcon dataCoord={parseCoordToKey(cell)} />;
  }

  function renderCellBasedOnType(cell: Coordinate) {
    switch (cell.type) {
      case CellTypes.Number:
        return cell.neighbourMinesCount;
      case CellTypes.Empty:
        return "";
      case CellTypes.Mine:
        return <MineIcon type={MineTypes.default} />;
      default:
        return null;
    }
  }

  function renderCell(cell: Coordinate) {
    if (!cell) return null;
    if (!cell.show) return "";
    if (cell.flagged) return flaggedCellRender(cell);

    return renderCellBasedOnType(cell);
  }

  const rows = new Array(rowsCount).fill(0);
  const columns = new Array(columnsCount).fill(0);

  const cellClickHandler = (cell: Coordinate) =>
    isGameOver ? null : handleCellClick(cell);

  return (
    <AreaWrapper>
      {rows.map((_, r) => {
        return (
          <Row key={uuid()}>
            {columns.map((_, c) => {
              const cellKey = parseCoordToKey({ x: c, y: r });
              const cell = allCoordinates[cellKey];
              if (!cell) return null;

              const coordAsKey = parseCoordToKey(cell);
              return (
                <CellWrapper
                  key={coordAsKey}
                  onClick={() => cellClickHandler(cell)}
                  data-coord={coordAsKey}
                  showEmpty={
                    cell.show && !cell.flagged && cell.type === CellTypes.Empty
                  }
                >
                  {renderCell(cell)}
                </CellWrapper>
              );
            })}
          </Row>
        );
      })}
    </AreaWrapper>
  );
};

export default PlayArea;
