"use client";

import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import Home from "./page";

// Mock the useSliders hook to control its output for testing purposes
jest.mock("@/hooks/useSliders", () => ({
  useSliders: () => ({
    sliders: [
      { id: 1, image: "/assets/slide/new_ford.jpg", title: "Slide 1" },
      { id: 2, image: "/assets/slide/new_ford_3.jpg", title: "Slide 2" },
    ],
    loading: false,
    error: null,
  }),
}));

// Mock the useHomeSettings hook
jest.mock("@/hooks/useHomeSettings", () => ({
  useHomeSettings: () => ({
    settings: {},
    allSettings: [],
    loading: false,
    error: null,
  }),
}));

// Mock the useDeliveryPartners hook
jest.mock("@/hooks/useDeliveryPartners", () => ({
  useDeliveryPartners: () => ({
    partners: [],
    loading: false,
    error: null,
  }),
}));

// Mock the useShipping hook
jest.mock("@/hooks/useShipping", () => ({
  useShipping: () => ({
    shipping: [],
    loading: false,
    error: null,
  }),
}));

// Mock the useProducts hook
jest.mock("@/hooks/useProducts", () => ({
  useProducts: () => ({
    products: [],
    loading: false,
    error: null,
  }),
}));


describe("Home page", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

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

  it("should throttle carousel navigation clicks", async () => {
    render(<Home />);

    const nextButton = screen.getByLabelText("Next slide");
    const prevButton = screen.getByLabelText("Previous slide");

    // Initial slide title
    expect(screen.getByRole("heading", { name: /Slide 1/i })).toBeInTheDocument();

    // Click next rapidly multiple times
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    // Only one slide change should be registered due to throttling (500ms delay + 500ms transition)
    act(() => {
      jest.advanceTimersByTime(500); // Pass 500ms for the throttle
    });
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Slide 2/i })).toBeInTheDocument();
    });

    // Another click, but not enough time passed
    fireEvent.click(nextButton);
    act(() => {
      jest.advanceTimersByTime(200); // Only 200ms
    });
    // Should still be on Slide 2
    expect(screen.getByRole("heading", { name: /Slide 2/i })).toBeInTheDocument();

    // More time passes, allowing another click
    act(() => {
      jest.advanceTimersByTime(300); // Another 300ms, total 500ms
    });
    fireEvent.click(nextButton);
    act(() => {
      jest.advanceTimersByTime(500);
    });
    // Should go back to Slide 1 (looping)
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Slide 1/i })).toBeInTheDocument();
    });

    // Test prev button throttling
    fireEvent.click(prevButton);
    fireEvent.click(prevButton);
    act(() => {
      jest.advanceTimersByTime(500);
    });
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Slide 2/i })).toBeInTheDocument();
    });
  });
});
