import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Header, { IProps } from "./index";

describe("<Header />", () => {
  let props: IProps;

  beforeEach(() => {
    props = {
      flagsCount: 10,
      isGameOver: false,
      isWon: false,
      reset: jest.fn(),
    };
  });

  it("should render correctly", () => {
    render(<Header {...props} />);
    const counterElement = screen.getByText(/Flags remaining/);

    expect(counterElement).toHaveTextContent("Flags remaining: 10");
  });

  it("calls reset round smile icon click", () => {
    const { container } = render(<Header {...props} />);

    const smileIcon = container.querySelector('[data-test="smile-reset-icon"]');

    smileIcon && fireEvent.click(smileIcon);

    expect(props.reset).toHaveBeenCalledTimes(1);
  });
});
