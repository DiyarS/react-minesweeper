import React, { useEffect, useState, useRef } from "react";
import isEqual from "lodash.isequal";
import { IGameConfig } from "../../interfaces";
import MineIcon from "./MineIcon";
import { AreaWrapper, Row, Cell } from "./styles";

interface IProps {
  config: IGameConfig;
}

type Coordinate = {
  x: number;
  y: number;
  type?: string;
  neighbourMinesCount?: number;
  show?: boolean;
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

const PlayArea: React.FC<IProps> = ({ config }) => {
  const { rowsCount, columnsCount, minesCount } = config;
  const [allCoordinates, setAllCoordinates] = useState<CoordinatesDict>({});
  const prevAllCoordinates = useRef<CoordinatesDict>();
  const [isGameOver, setGameOver] = useState(false);

  useEffect(() => {
    rowsCount && columnsCount && minesCount && setupMines();
  }, [rowsCount, columnsCount, minesCount]);

  useEffect(() => {
    if (
      !isEqual(prevAllCoordinates.current, allCoordinates) &&
      Object.keys(allCoordinates).length
    ) {
      calcNeighbourMines();
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
  }, [isGameOver]);

  useEffect(() => {
    prevAllCoordinates.current = allCoordinates;
  });

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
        const xStart = centralCoord.x - 1 >= 0 ? centralCoord.x - 1 : 0;
        const yStart = centralCoord.y - 1 >= 0 ? centralCoord.y - 1 : 0;

        for (let x = xStart; x <= centralCoord.x + 1; x++) {
          for (let y = yStart; y <= centralCoord.y + 1; y++) {
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
    } else if (cell.type === CellTypes.Number) {
      const coordinates = Object.assign({}, allCoordinates);
      const coordAsKey: string = parseCoordToKey(cell);
      coordinates[coordAsKey].show = true;

      setAllCoordinates(coordinates);
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

  function renderCell(cell: Coordinate) {
    if (!cell) return null;
    if (!cell.show) return "";

    switch (cell.type) {
      case CellTypes.Number:
        return cell.neighbourMinesCount;
      case CellTypes.Empty:
        return "";
      case CellTypes.Mine:
        return <MineIcon type="default" />;
      default:
        return null;
    }
  }

  const rows = new Array(rowsCount).fill(0);
  const columns = new Array(columnsCount).fill(0);
  const cellClickHandler = (cell: Coordinate) =>
    isGameOver ? null : handleCellClick(cell);

  return (
    <AreaWrapper>
      <div>Play Area</div>
      <AreaWrapper>
        {rows.map((_, r) => {
          return (
            <Row>
              {columns.map((_, c) => {
                const cellKey = parseCoordToKey({ x: c, y: r });
                const cell = allCoordinates[cellKey];
                return (
                  <div>
                    <Cell onClick={() => cellClickHandler(cell)}>
                      {renderCell(cell)}
                    </Cell>
                  </div>
                );
              })}
            </Row>
          );
        })}
      </AreaWrapper>
    </AreaWrapper>
  );
};

export default PlayArea;
