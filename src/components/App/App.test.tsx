import React from "react";
import { render } from "@testing-library/react";
import App from "./index";

describe("<App />", () => {
  it("should render header, play area and configs modal", () => {
    const { container } = render(<App />);
    const header = container.querySelector('[data-test="header-component"]');
    const playArea = container.querySelector(
      '[data-test="play-area-component"]'
    );

    expect(header).toBeInTheDocument();
    expect(playArea).toBeInTheDocument();

    setTimeout(() => {
      const configsModal = container.querySelector(
        '[data-test="configs-modal-component"]'
      );
      expect(configsModal).toBeInTheDocument();
    }, 1000);
  });
});
