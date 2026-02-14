import { createClient } from "redis";
import { downloadS3Folder } from "./aws.js";
import { buildProject } from "./utils.js";
import { uploadFile } from "./aws.js";
import { getAllFiles } from './file.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  const id = res?.element;
  await buildProject(id as string);
  const files = getAllFiles(path.join(__dirname,`/output/${id}/dist`));
  console.log(path.join(__dirname,`/output/${id}/dist`));

  for (const file of files) {
    await uploadFile(`${id}/${path.basename(file)}`, file);
  }
}
}

main();