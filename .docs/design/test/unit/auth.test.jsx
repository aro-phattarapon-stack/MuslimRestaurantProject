import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AuthModal from "../../src/components/AuthModal/AuthModal";

const t = (key) => key;

describe("prototype authentication", () => {
  it("shows required-field validation", () => {
    render(
      <AuthModal mode="signup" onClose={vi.fn()} onAuthenticated={vi.fn()} t={t} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "continue" }));
    expect(screen.getByRole("alert")).toHaveTextContent("errorRequired");
  });

  it("registers an account and stores browser-local session data", () => {
    const onAuthenticated = vi.fn();
    render(
      <AuthModal
        mode="signup"
        onClose={vi.fn()}
        onAuthenticated={onAuthenticated}
        t={t}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText("namePlaceholder"), {
      target: { value: "Local Tester" },
    });
    fireEvent.change(screen.getByPlaceholderText("emailPlaceholder"), {
      target: { value: "Test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("passwordPlaceholder"), {
      target: { value: "local123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "continue" }));

    expect(onAuthenticated).toHaveBeenCalledWith({
      name: "Local Tester",
      email: "test@example.com",
    });
    expect(JSON.parse(localStorage.getItem("halal-session"))).toEqual(
      expect.objectContaining({
        name: "Local Tester",
        email: "test@example.com",
      }),
    );
  });

  it("rejects duplicate registration and invalid login", () => {
    localStorage.setItem(
      "halal-accounts",
      JSON.stringify([
        { name: "Existing", email: "existing@example.com", password: "valid123" },
      ]),
    );

    const first = render(
      <AuthModal mode="signup" onClose={vi.fn()} onAuthenticated={vi.fn()} t={t} />,
    );
    fireEvent.change(screen.getByPlaceholderText("namePlaceholder"), {
      target: { value: "Duplicate" },
    });
    fireEvent.change(screen.getByPlaceholderText("emailPlaceholder"), {
      target: { value: "existing@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("passwordPlaceholder"), {
      target: { value: "valid123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "continue" }));
    expect(screen.getByRole("alert")).toHaveTextContent("errorEmailExists");

    first.unmount();
    render(
      <AuthModal mode="login" onClose={vi.fn()} onAuthenticated={vi.fn()} t={t} />,
    );
    fireEvent.change(screen.getByPlaceholderText("emailPlaceholder"), {
      target: { value: "existing@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("passwordPlaceholder"), {
      target: { value: "wrong123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "continue" }));
    expect(screen.getByRole("alert")).toHaveTextContent("errorInvalidCredentials");
  });
});
