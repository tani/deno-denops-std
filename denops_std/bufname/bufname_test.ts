import { assertEquals, assertThrows } from "../deps_test.ts";
import { path } from "../deps.ts";
import { format, parse } from "./bufname.ts";

Deno.test("format throws exception when 'scheme' contains unusable characters", () => {
  assertThrows(
    () =>
      format({
        scheme: "denops0number",
        expr: "/absolute/path/to/worktree",
      }),
    undefined,
    "contains unusable characters",
  );
  assertThrows(
    () =>
      format({
        scheme: "denops+plus",
        expr: "/absolute/path/to/worktree",
      }),
    undefined,
    "contains unusable characters",
  );
  assertThrows(
    () =>
      format({
        scheme: "denops-minus",
        expr: "/absolute/path/to/worktree",
      }),
    undefined,
    "contains unusable characters",
  );
  assertThrows(
    () =>
      format({
        scheme: "denops.dot",
        expr: "/absolute/path/to/worktree",
      }),
    undefined,
    "contains unusable characters",
  );
  assertThrows(
    () =>
      format({
        scheme: "denops_underscore",
        expr: "/absolute/path/to/worktree",
      }),
    undefined,
    "contains unusable characters",
  );
});
Deno.test("format returns buffer name string from Bufname instance", () => {
  const src = {
    scheme: "denops",
    expr: "/absolute/path/to/worktree",
  };
  const dst = format(src);
  const exp = "denops:///absolute/path/to/worktree";
  assertEquals(dst, exp);
});
Deno.test("format encodes unusable characters in 'expr'", () => {
  const src = {
    scheme: "denops",
    expr: "/<>|?*",
  };
  const dst = format(src);
  const exp = "denops:///%3C%3E%7C%3F%2A";
  assertEquals(dst, exp);
});
Deno.test("format returns buffer name string from Bufname instance (with URLSearchParams)", () => {
  const src = {
    scheme: "denops",
    expr: "/absolute/path/to/worktree",
    params: {
      foo: "foo",
      bar: ["bar", "bar"],
      hoge: undefined,
    },
  };
  const dst = format(src);
  const exp = "denops:///absolute/path/to/worktree;foo=foo&bar=bar&bar=bar";
  assertEquals(dst, exp);
});
Deno.test("format encodes unusable characters in 'params'", () => {
  const src = {
    scheme: "denops",
    expr: "/absolute/path/to/worktree",
    params: {
      foo: "<>|?*",
    },
  };
  const dst = format(src);
  const exp = "denops:///absolute/path/to/worktree;foo=%3C%3E%7C%3F%2A";
  assertEquals(dst, exp);
});
Deno.test("format returns buffer name string from Bufname instance (with fragment)", () => {
  const src = {
    scheme: "denops",
    expr: "/absolute/path/to/worktree",
    fragment: "Hello World.md",
  };
  const dst = format(src);
  const exp = "denops:///absolute/path/to/worktree#Hello World.md";
  assertEquals(dst, exp);
});
Deno.test("format encodes unusable characters in 'fragment'", () => {
  const src = {
    scheme: "denops",
    expr: "/absolute/path/to/worktree",
    fragment: "<>|?*",
  };
  const dst = format(src);
  const exp = "denops:///absolute/path/to/worktree#%3C%3E%7C%3F%2A";
  assertEquals(dst, exp);
});
Deno.test("format returns buffer name string from Bufname instance (with URLSearchParams and fragment)", () => {
  const src = {
    scheme: "denops",
    expr: "/absolute/path/to/worktree",
    params: {
      foo: "foo",
      bar: ["bar", "bar"],
      hoge: undefined,
    },
    fragment: "Hello World.md",
  };
  const dst = format(src);
  const exp =
    "denops:///absolute/path/to/worktree;foo=foo&bar=bar&bar=bar#Hello World.md";
  assertEquals(dst, exp);
});
Deno.test("format encodes ';' and '#' in 'expr'", () => {
  const src = {
    scheme: "denops",
    expr: "/hello;world#hello",
  };
  const dst = format(src);
  const exp = "denops:///hello%3Bworld%23hello";
  assertEquals(dst, exp);
});
Deno.test("format encodes '#' in 'params'", () => {
  const src = {
    scheme: "denops",
    expr: "/absolute/path/to/worktree",
    params: {
      foo: "#foo",
    },
  };
  const dst = format(src);
  const exp = "denops:///absolute/path/to/worktree;foo=%23foo";
  assertEquals(dst, exp);
});
Deno.test("format pass example in README.md", () => {
  assertEquals(
    format({
      scheme: "denops",
      expr: "/Users/John Titor/test.git",
    }),
    "denops:///Users/John Titor/test.git",
  );

  assertEquals(
    format({
      scheme: "denops",
      expr: "/Users/John Titor/test.git",
      params: {
        foo: "foo",
        bar: ["bar1", "bar2"],
      },
    }),
    "denops:///Users/John Titor/test.git;foo=foo&bar=bar1&bar=bar2",
  );

  assertEquals(
    format({
      scheme: "denops",
      expr: "/Users/John Titor/test.git",
      fragment: "README.md",
    }),
    "denops:///Users/John Titor/test.git#README.md",
  );

  assertEquals(
    format({
      scheme: "denops",
      expr: "/Users/John Titor/test.git",
      params: {
        foo: "foo",
        bar: ["bar1", "bar2"],
      },
      fragment: "README.md",
    }),
    "denops:///Users/John Titor/test.git;foo=foo&bar=bar1&bar=bar2#README.md",
  );

  assertEquals(
    format({
      scheme: "denops",
      expr: path.win32.toFileUrl("C:\\Users\\John Titor\\test.git").pathname,
    }),
    "denops:///C:/Users/John%20Titor/test.git",
  );
});

Deno.test("parse throws exception when 'expr' contains unusable characters", () => {
  const src = "denops:///<>|?*";
  assertThrows(
    () => {
      parse(src);
    },
    undefined,
    "contains unusable characters",
  );
});
Deno.test("parse throws exception when scheme part of 'expr' contains unusable characters", () => {
  assertThrows(
    () => parse("denops0number://absolute/path/to/worktree"),
    undefined,
    "contains unusable characters",
  );
  assertThrows(
    () => parse("denops+plus://absolute/path/to/worktree"),
    undefined,
    "contains unusable characters",
  );
  assertThrows(
    () => parse("denops+minus://absolute/path/to/worktree"),
    undefined,
    "contains unusable characters",
  );
  assertThrows(
    () => parse("denops.dot://absolute/path/to/worktree"),
    undefined,
    "contains unusable characters",
  );
  assertThrows(
    () => parse("denops_underscore://absolute/path/to/worktree"),
    undefined,
    "contains unusable characters",
  );
});
Deno.test("parse returns Bufname instance from buffer name", () => {
  const src = "denops:///absolute/path/to/worktree";
  const dst = parse(src);
  const exp = {
    scheme: "denops",
    expr: "/absolute/path/to/worktree",
  };
  assertEquals(dst, exp);
});
Deno.test("parse decodes percent-encoded characters in 'expr'", () => {
  const src = "denops:///%3C%3E%7C%3F%2A";
  const dst = parse(src);
  const exp = {
    scheme: "denops",
    expr: "/<>|?*",
  };
  assertEquals(dst, exp);
});
Deno.test("parse returns Bufname instance from buffer name (with params)", () => {
  const src = "denops:///absolute/path/to/worktree;foo=foo&bar=bar&bar=bar";
  const dst = parse(src);
  const exp = {
    scheme: "denops",
    expr: "/absolute/path/to/worktree",
    params: {
      foo: "foo",
      bar: ["bar", "bar"],
    },
  };
  assertEquals(dst, exp);
});
Deno.test("parse decodes percent-encoded characters in 'params'", () => {
  const src = "denops:///absolute/path/to/worktree;foo=%3C%3E%7C%3F%2A";
  const dst = parse(src);
  const exp = {
    scheme: "denops",
    expr: "/absolute/path/to/worktree",
    params: {
      foo: "<>|?*",
    },
  };
  assertEquals(dst, exp);
});
Deno.test("parse returns Bufname instance from buffer name (with fragment)", () => {
  const src = "denops:///absolute/path/to/worktree#Hello World.md";
  const dst = parse(src);
  const exp = {
    scheme: "denops",
    expr: "/absolute/path/to/worktree",
    fragment: "Hello World.md",
  };
  assertEquals(dst, exp);
});
Deno.test("parse decodes percent-encoded characters in 'fragment'", () => {
  const src = "denops:///absolute/path/to/worktree#%3C%3E%7C%3F%2A";
  const dst = parse(src);
  const exp = {
    scheme: "denops",
    expr: "/absolute/path/to/worktree",
    fragment: "<>|?*",
  };
  assertEquals(dst, exp);
});
Deno.test("parse returns Bufname instance from buffer name (with params and fragment)", () => {
  const src =
    "denops:///absolute/path/to/worktree;foo=foo&bar=bar&bar=bar#Hello World.md";
  const dst = parse(src);
  const exp = {
    scheme: "denops",
    expr: "/absolute/path/to/worktree",
    params: {
      foo: "foo",
      bar: ["bar", "bar"],
    },
    fragment: "Hello World.md",
  };
  assertEquals(dst, exp);
});
Deno.test("parse decode percent-encoded characters (';' and '#') in 'expr'", () => {
  const src = "denops:///hello%3Bworld%23hello";
  const dst = parse(src);
  const exp = {
    scheme: "denops",
    expr: "/hello;world#hello",
  };
  assertEquals(dst, exp);
});
Deno.test("parse decode percent-encoded characters ('#') in 'params'", () => {
  const src = "denops:///absolute/path/to/worktree;foo=%23foo";
  const dst = parse(src);
  const exp = {
    scheme: "denops",
    expr: "/absolute/path/to/worktree",
    params: {
      foo: "#foo",
    },
  };
  assertEquals(dst, exp);
});
Deno.test("parse pass example in README.md", () => {
  assertEquals(
    parse("denops:///Users/John Titor/test.git"),
    {
      scheme: "denops",
      expr: "/Users/John Titor/test.git",
    },
  );

  assertEquals(
    parse("denops:///Users/John Titor/test.git;foo=foo&bar=bar1&bar=bar2"),
    {
      scheme: "denops",
      expr: "/Users/John Titor/test.git",
      params: {
        foo: "foo",
        bar: ["bar1", "bar2"],
      },
    },
  );

  assertEquals(
    parse("denops:///Users/John Titor/test.git#README.md"),
    {
      scheme: "denops",
      expr: "/Users/John Titor/test.git",
      fragment: "README.md",
    },
  );

  assertEquals(
    parse(
      "denops:///Users/John Titor/test.git;foo=foo&bar=bar1&bar=bar2#README.md",
    ),
    {
      scheme: "denops",
      expr: "/Users/John Titor/test.git",
      params: {
        foo: "foo",
        bar: ["bar1", "bar2"],
      },
      fragment: "README.md",
    },
  );

  const bufname = parse("denops:///C:/Users/John%20Titor/test.git");
  assertEquals(
    bufname,
    {
      scheme: "denops",
      expr: "/C:/Users/John Titor/test.git",
    },
  );
  assertEquals(
    path.win32.fromFileUrl(`file://${bufname.expr}`),
    "C:\\Users\\John Titor\\test.git",
  );
});
