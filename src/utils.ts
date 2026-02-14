import { exec, spawn } from "child_process";
import path from "path";
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
    const child = exec(`cd ${projectPath} && ${npmCmd} install && ${npmCmd} run build`);

        child.stdout?.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        child.stderr?.on('data', function(data) {
            console.log('stderr: ' + data);
        });

        child.on('close', function(code) {
           return resolve();
        });

    })
};