import { describe, it, expect, beforeEach } from "vitest";
import {
  saveInterests,
  getInterests,
  saveSources,
  getSources,
  saveDateRange,
  getDateRange,
  saveOnlyInterests,
  getOnlyInterests,
  saveOnboarded,
  getOnboarded,
  hasSavedPreferences,
} from "@/lib/storage";

describe("storage", () => {
  beforeEach(() => localStorage.clear());

  it("round-trips interests", () => {
    saveInterests(["AI / ML", "Robotics"]);
    expect(getInterests()).toEqual(["AI / ML", "Robotics"]);
  });

  it("returns [] when nothing is stored", () => {
    expect(getInterests()).toEqual([]);
    expect(getSources()).toEqual([]);
  });

  it("drops invalid interest values from corrupt/legacy data", () => {
    localStorage.setItem(
      "cmu-compass-interests",
      JSON.stringify(["AI / ML", "ML", 42, null])
    );
    expect(getInterests()).toEqual(["AI / ML"]);
  });

  it("drops invalid source values", () => {
    localStorage.setItem(
      "cmu-compass-sources",
      JSON.stringify(["SCS", "Hogwarts"])
    );
    expect(getSources()).toEqual(["SCS"]);
  });

  it("returns [] when stored value is not an array", () => {
    localStorage.setItem("cmu-compass-interests", JSON.stringify({ a: 1 }));
    expect(getInterests()).toEqual([]);
  });

  it("returns [] when stored value is unparseable JSON", () => {
    localStorage.setItem("cmu-compass-interests", "{not json");
    expect(getInterests()).toEqual([]);
  });

  it("round-trips and validates date range", () => {
    saveDateRange("This Week");
    expect(getDateRange()).toBe("This Week");
  });

  it("defaults date range to All for missing or invalid values", () => {
    expect(getDateRange()).toBe("All");
    localStorage.setItem("cmu-compass-date-range", JSON.stringify("Yesterday"));
    expect(getDateRange()).toBe("All");
  });

  it("coerces non-boolean onlyInterests to false", () => {
    localStorage.setItem("cmu-compass-only-interests", JSON.stringify("true"));
    expect(getOnlyInterests()).toBe(false);
    saveOnlyInterests(true);
    expect(getOnlyInterests()).toBe(true);
  });

  it("tracks the onboarded flag", () => {
    expect(getOnboarded()).toBe(false);
    saveOnboarded(true);
    expect(getOnboarded()).toBe(true);
  });

  it("hasSavedPreferences reflects onboarding and any persisted preference", () => {
    expect(hasSavedPreferences()).toBe(false);
    saveSources(["Tepper"]);
    expect(hasSavedPreferences()).toBe(true);
    localStorage.clear();
    expect(hasSavedPreferences()).toBe(false);
    saveOnboarded(true);
    expect(hasSavedPreferences()).toBe(true);
  });
});
