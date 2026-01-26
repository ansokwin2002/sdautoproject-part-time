"use client";

import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home page", () => {
  it("should render the hero carousel", () => {
    render(<Home />);
    const heroCarousel = screen.getByRole("region", { name: /slideshow/i });
    expect(heroCarousel).toBeInTheDocument();
  });

  it("should render the welcome section", () => {
    render(<Home />);
    const welcomeSection = screen.getByRole("heading", {
      name: /welcome to sd auto parts/i,
    });
    expect(welcomeSection).toBeInTheDocument();
  });

  it("should render the our delivery section", () => {
    render(<Home />);
    const deliverySection = screen.getByRole("heading", {
      name: /our delivery partners/i,
    });
    expect(deliverySection).toBeInTheDocument();
  });

  it("should render the why choose section", () => {
    render(<Home />);
    const whyChooseSection = screen.getByRole("heading", {
      name: /why choose sd auto?/i,
    });
    expect(whyChooseSection).toBeInTheDocument();
  });
});
