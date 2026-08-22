import { describe, expect, it } from "vitest";
import { routeFromHash } from "./App";

describe("routeFromHash", () => {
  it("resolves plain page routes", () => {
    expect(routeFromHash("#/explore")).toEqual({ page: "explore" });
    expect(routeFromHash("#/dashboard")).toEqual({ page: "dashboard" });
    expect(routeFromHash("")).toEqual({ page: "home" });
    expect(routeFromHash("#/")).toEqual({ page: "home" });
  });

  it("resolves slug routes", () => {
    expect(routeFromHash("#/horse/shaheen")).toEqual({ page: "horse", slug: "shaheen" });
    expect(routeFromHash("#/stable/valley-stud")).toEqual({ page: "stable", slug: "valley-stud" });
  });

  // Regression test for the bug fixed in this project: routeFromHash used to
  // split on "/" without first stripping the query string, so any hash with
  // a "?" glued directly onto the page/slug segment (no intervening "/")
  // produced a polluted page name or slug and silently fell back to home /
  // the wrong horse. See routeFromHash's hash.split("?")[0] step.
  it("strips the query string before parsing a page-only route", () => {
    expect(routeFromHash("#/explore?type=training")).toEqual({ page: "explore" });
    expect(routeFromHash("#/explore?city=%D8%A7%D9%84%D8%B1%D9%8A%D8%A7%D8%B6&type=training")).toEqual({
      page: "explore",
    });
  });

  it("strips the query string before parsing a slug route, so the slug is never polluted", () => {
    expect(routeFromHash("#/book/barq?service=30000000-0000-0000-0000-000000000004")).toEqual({
      page: "book",
      slug: "barq",
    });
  });

  it("falls back to home for anything unrecognized", () => {
    expect(routeFromHash("#/does-not-exist")).toEqual({ page: "home" });
    expect(routeFromHash("#/does-not-exist?with=query")).toEqual({ page: "home" });
  });
});
