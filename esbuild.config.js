const { build } = require("esbuild")
const copyStaticFiles = require('esbuild-copy-static-files')

build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  bundle: true,
  platform: "node",
  format: "cjs"
  // pass any options to esbuild here...
}).then(() => console.log("\n ✨ Done! ✨")).catch((e) => { throw e;})