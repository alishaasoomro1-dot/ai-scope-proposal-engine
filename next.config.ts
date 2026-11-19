import { resolve } from "node:path";

const config = {
  // Keep Turbopack scoped to this app when the parent folder has another lockfile.
  turbopack: { root: resolve(process.cwd()) },
};

export default config;
