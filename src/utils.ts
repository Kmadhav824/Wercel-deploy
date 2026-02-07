import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

export function buildProject(id: string) {
  return new Promise<void>((resolve, reject) => {
    const projectPath = path.join(
      path.dirname(__dirname),
      "dist",
      "output",
      id
    );

    // 🔴 THIS WAS MISSING
    if (!fs.existsSync(projectPath)) {
      reject(new Error(`Project path does not exist: ${projectPath}`));
      return;
    }

    console.log("Building at:", projectPath);

    const install = spawn("ls", ["-la"], { stdio: "inherit" });
    // const install = spawn("npm", ["install"], {
    //   cwd: projectPath,
    //   stdio: "inherit",
    //   shell: false,
    //   detached: true
    // });
    // console.log(install);
    install.on("error", reject);

    install.on("close", (code) => {
      if (code !== 0) return reject(new Error("npm install failed"));

    //   const child = spawn(]);
    //   const build = spawn("ls", ["-la"], {
    //     cwd: projectPath,
    //     stdio: "inherit",
    //     detached: true
    //   });

    //   build.on("error", reject);

    //   build.on("close", (code) => {
    //     if (code !== 0) return reject(new Error("build failed"));
    //     resolve();
    //   });
    });
  });
}
