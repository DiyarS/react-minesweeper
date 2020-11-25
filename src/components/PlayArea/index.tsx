import React, { useEffect, useState, useRef } from "react";
import isEqual from "lodash.isequal";
import { IGameConfig } from "../../interfaces";
import MineIcon from "./MineIcon";
import FlagIcon from "./FlagIcon";
import { AreaWrapper, Row, Cell } from "./styles";
import { MineTypes } from "./MineIcon";
import { uuid } from "../../utils";

interface IProps {
  config: IGameConfig;
  isGameOver: boolean;
  setGameOver: (isGameOver: boolean) => void;
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

const PlayArea: React.FC<IProps> = ({ config, isGameOver, setGameOver }) => {
  const { rowsCount, columnsCount, minesCount } = config;
  const [allCoordinates, setAllCoordinates] = useState<CoordinatesDict>({});
  const prevAllCoordinates = useRef<CoordinatesDict>();
  const prevIsGameOver = useRef<boolean>();

  useEffect(() => {
    rowsCount && columnsCount && minesCount && setupMines();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [rowsCount, columnsCount, minesCount]);

  useEffect(() => {
    if (
      !isEqual(prevAllCoordinates.current, allCoordinates) &&
      Object.keys(allCoordinates).length
    ) {
      calcNeighbourMines();
      document.addEventListener("contextmenu", handleCellFlag);
    }
  }, [allCoordinates]);

  useEffect(() => {
    if (isGameOver) {
      const coordinates = Object.assign({}, allCoordinates);

      for (let key in coordinates) {
        if (coordinates[key].type === CellTypes.Mine)
          coordinates[key].show = true;
      }

      setAllCoordinates(coordinates);
    }

    if (!isGameOver && prevIsGameOver.current) {
      setupMines();
    }
  }, [isGameOver]);

  useEffect(() => {
    prevAllCoordinates.current = allCoordinates;
    prevIsGameOver.current = isGameOver;
  });

  function handleCellFlag(event: MouseEvent) {
    event.preventDefault();

    const target = event.target as HTMLElement;
    const cellKey = target!.getAttribute("data-coord");
    const coordinates = Object.assign({}, allCoordinates);

    if (cellKey && coordinates[cellKey]) {
      const cell = coordinates[cellKey];

      cell.flagged = true;
      cell.show = true;

      setAllCoordinates(coordinates);
    }
  }

  function parseCoordToKey(coordinate: Coordinate): string {
    return `${coordinate.x}-${coordinate.y}`;
  }

  function setupMines() {
    const minesCoordinates: CoordinatesDict = generateMinesCoordinates();
    const coordinates: CoordinatesDict = {};

    for (let c = 0; c < columnsCount; c++) {
      for (let r = 0; r < rowsCount; r++) {
        const coordinate: Coordinate = { x: c, y: r, type: CellTypes.Empty };
        const coordinateAsKey = parseCoordToKey(coordinate);
        if (minesCoordinates[coordinateAsKey]) {
          coordinate.type = CellTypes.Mine;
        }

        coordinates[coordinateAsKey] = coordinate;
      }
    }

    setAllCoordinates(coordinates);
  }

  function calcNeighbourMines() {
    const coordinates = Object.assign({}, allCoordinates);

    for (const coordKey in coordinates) {
      const centralCoord: Coordinate = coordinates[coordKey];
      if (centralCoord.type !== CellTypes.Mine) {
        let neighbourMinesCount = 0;

        for (let x = centralCoord.x - 1; x <= centralCoord.x + 1; x++) {
          for (let y = centralCoord.y - 1; y <= centralCoord.y + 1; y++) {
            const coordAsKey: string = parseCoordToKey({ x, y });
            const neighbourCoord: Coordinate = coordinates[coordAsKey];

            if (neighbourCoord && neighbourCoord.type === CellTypes.Mine) {
              neighbourMinesCount++;
            }
          }
        }

        if (neighbourMinesCount > 0) {
          centralCoord.neighbourMinesCount = neighbourMinesCount;
          centralCoord.type = CellTypes.Number;
        }
      }
    }

    setAllCoordinates(coordinates);
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
      x: getRandomArbitrary(0, columnsCount),
      y: getRandomArbitrary(0, rowsCount),
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

    return <FlagIcon />;
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
                <div>
                  <Cell
                    key={coordAsKey}
                    onClick={() => cellClickHandler(cell)}
                    data-coord={coordAsKey}
                    showEmpty={cell.show && cell.type === CellTypes.Empty}
                  >
                    {renderCell(cell)}
                  </Cell>
                </div>
              );
            })}
          </Row>
        );
      })}
    </AreaWrapper>
  );
};

export default PlayArea;
