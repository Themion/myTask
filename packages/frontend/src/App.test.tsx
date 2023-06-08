import App from "~/App";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

describe("App", () => {
  it("renders", () => {
    render(<App />);
    const linkElement = screen.getByText(/Vite \+ React/i);
    expect(linkElement).toBeDefined();
  });
});
