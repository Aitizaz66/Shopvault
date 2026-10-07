import { readdir, readFile } from "node:fs/promises";
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";

// Use the application's own Vite compiler, with no second bundler or transpiler.
export async function registerJSX(root, transform) {
  const compiled = new Map();
  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = `${directory}/${entry.name}`;
      if (entry.isDirectory()) await walk(file);
      else if (file.endsWith(".jsx")) compiled.set(pathToFileURL(file).href, (await transform(await readFile(file, "utf8"), file, { jsx: { runtime: "automatic" } })).code);
    }
  }
  await walk(`${root}/src`);
  registerHooks({ load(url, context, nextLoad) {
    if (compiled.has(url)) return { format: "module", source: compiled.get(url), shortCircuit: true };
    return nextLoad(url, context);
  } });
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
}
