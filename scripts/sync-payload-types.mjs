import { readFile, writeFile } from "node:fs/promises";

const generated = await readFile(
  new URL("../src/payload-types.ts", import.meta.url),
  "utf8",
);
// Frontends consume interfaces only and do not depend on the Payload runtime.
const interfaces = generated.replace(/declare module 'payload' \{[\s\S]*$/, "").trimEnd() + "\n";
for (const company of ["localize", "rastrear"]) {
  await writeFile(
    new URL(`../../${company}/src/payload-types.ts`, import.meta.url),
    interfaces,
  );
}
