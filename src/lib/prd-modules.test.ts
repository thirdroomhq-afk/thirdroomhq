import { describe, expect, it } from "vitest";
import { PRIORITY_MODULES } from "./prd-modules";

describe("PRD module map", () => {
  it("exposes the phase 1, phase 2, phase 3, and phase 4 internal operating system modules", () => {
    expect(PRIORITY_MODULES.map((module) => module.id)).toEqual([
      "dashboard",
      "brain",
      "knowledge",
      "projects",
      "partners",
      "ai",
      "decisions",
      "documents",
      "products",
      "blueprints",
      "sales",
      "operations",
      "people",
      "finance",
      "insights",
      "automations",
      "governance",
      "clients",
      "marketplace",
      "academy",
      "community",
    ]);
  });

  it("links each module to a route", () => {
    expect(PRIORITY_MODULES.every((module) => Boolean(module.route))).toBe(true);
  });
});
