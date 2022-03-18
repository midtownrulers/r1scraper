const { build } = require("esbuild")
var childProcess = require("child_process");
var path = require("path");

build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  bundle: true,
  platform: "node",
  format: "cjs",
  watch: true
}).then(result => {
  console.log('watching...')
})