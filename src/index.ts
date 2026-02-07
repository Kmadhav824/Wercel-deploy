import { createClient } from "redis";
import { downloadS3Folder } from "./aws.js";
import { buildProject } from "./utils.js";

const subscriber = createClient();

await subscriber.connect();

async function main() {
  while (true) {
    const res = await subscriber.brPop("build-queue", 0);

    // res is { key: 'build-queue', element: '...' }
    console.log(res);
    // @ts-ignore
    await downloadS3Folder(res?.element);
    
    // @ts-ignore
    await buildProject(res.element);
  }
}

main();