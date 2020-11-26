import React from "react";
import { render, fireEvent } from "@testing-library/react";
import PlayArea, { IProps } from "./index";

describe("<PlayArea />", () => {
  let props: IProps;

  beforeEach(() => {
    props = {
      config: { rowsCount: 10, columnsCount: 10, minesCount: 30 },
      flagsCount: 10,
      isGameOver: false,
      _setFlagsCount: jest.fn(),
      setGameOver: jest.fn(),
      setShowCongratz: jest.fn(),
    };
  });

  it("should render correctly", () => {
    const { container } = render(<PlayArea {...props} />);
    const rows = container.querySelectorAll('[data-test="play-area-row"]');
    const cells = container.querySelectorAll('[data-test="play-area-cell"]');

    expect(rows).toHaveLength(props.config.rowsCount);
    expect(cells).toHaveLength(
      props.config.rowsCount * props.config.columnsCount
    );
  });

  it("should end game if bomb cell was clicked", () => {
    const { container } = render(<PlayArea {...props} />);
    const mine = container.querySelector(".mine-cell");

    mine && fireEvent.click(mine);

    const blownMines = container.querySelectorAll(".blown");
    expect(blownMines.length).toBe(props.config.minesCount);
  });
});
