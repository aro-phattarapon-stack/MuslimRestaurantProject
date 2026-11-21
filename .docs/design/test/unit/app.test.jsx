import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../../src/App";

describe("browser application interactions", () => {
  it("switches language and persists the choice after reload", () => {
    const first = render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "ภาษา: อังกฤษ" }));
    expect(localStorage.getItem("halal-language")).toBe("en");

    first.unmount();
    render(<App />);
    expect(screen.getByRole("button", { name: "Language: Thai" })).toBeInTheDocument();
  });

  it("searches by a restaurant name and renders matching cards", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "ค้นหาร้าน" }));
    const input = screen.getByPlaceholderText("ค้นหาร้าน เมนู หรือพื้นที่...");
    fireEvent.change(input, { target: { value: "786" } });

    expect(screen.getByText("786 Islamic Restaurant")).toBeInTheDocument();
  });

  it("adds and removes a favorite and persists the change", () => {
    localStorage.setItem(
      "halal-session",
      JSON.stringify({ name: "Local Tester", email: "tester@example.com" }),
    );
    localStorage.setItem("halal-favorites-tester@example.com", JSON.stringify([1]));

    const first = render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "ร้านโปรด" }));
    expect(screen.getByText("27%CAFE")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "บันทึกแล้ว" }));
    expect(JSON.parse(
      localStorage.getItem("halal-favorites-tester@example.com"),
    )).toEqual([]);

    first.unmount();
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "ร้านโปรด" }));
    expect(screen.queryByText("27%CAFE")).not.toBeInTheDocument();
  });

  it("opens a restaurant detail view", () => {
    render(<App />);
    fireEvent.click(screen.getByText("27%CAFE"));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("heading", { name: "27%CAFE" })).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "นำทาง" })).toBeInTheDocument();
  });
});
