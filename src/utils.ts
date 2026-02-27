import { exec } from "child_process";
import path from "path";

const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

export function buildProject(id: string) {
  return new Promise<void>((resolve, reject) => {
    // Must match the path where downloadS3Folder puts files
    const projectPath = path.join(process.cwd(), "dist", "output", id);

    const child = exec(
      `cd "${projectPath}" && ${npmCmd} install && ${npmCmd} run build`
    );

    child.stdout?.on("data", (data) => {
      console.log("stdout:", data);
    });
    child.stderr?.on("data", (data) => {
      console.error("stderr:", data);
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Build failed for ${id} with exit code ${code}`));
      } else {
        resolve();
      }
    });
  });
}