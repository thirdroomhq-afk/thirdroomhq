// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";
import { markWelcomeSeen, shouldShowWelcome } from "./onboarding";

describe("onboarding helpers", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows the welcome experience on first visit", () => {
    expect(shouldShowWelcome()).toBe(true);
  });

  it("hides the welcome experience after it has been seen", () => {
    markWelcomeSeen();
    expect(shouldShowWelcome()).toBe(false);
  });
});
