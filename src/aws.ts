import "dotenv/config";
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand
} from "@aws-sdk/client-s3";
import { pipeline } from "stream/promises";
import fs from "fs";
import { readFile } from "fs/promises";
import path from "path";
import { get } from "http";
const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_API as string,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string
  }
});

export async function downloadS3Folder(prefix: string) {
  const list = await s3.send(
    new ListObjectsV2Command({
      Bucket: "store",
      Prefix: prefix
    })
  );

  if (!list.Contents) return;

  await Promise.all(
    list.Contents.map(async (item) => {
      if (!item.Key) return;

      const outputPath = path.join(process.cwd(), "dist", "output", item.Key);
      const dir = path.dirname(outputPath);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const { Body } = await s3.send(
        new GetObjectCommand({
          Bucket: "store",
          Key: item.Key
        })
      );

      if (!Body) return;

      await pipeline(
        Body as NodeJS.ReadableStream,
        fs.createWriteStream(outputPath)
      );
    })
  );

  console.log("Download complete");
}

const getContentType = (fileName: string) => {
  const ext = path.extname(fileName).toLowerCase();
  if (ext === '.html') return 'text/html';
  if (ext === '.css') return 'text/css';
  if (ext === '.js') return 'application/javascript';
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  return 'application/octet-stream';
};

export async function uploadFile(
  fileName: string,
  localFilePath: string
): Promise<void> {
  const fileContent = await readFile(localFilePath);

  const command = new PutObjectCommand({
    Bucket: "build",
    Key: fileName,
    Body: fileContent,
    ContentType: getContentType(fileName)
  });

  await s3.send(command);
  console.log(`Uploaded ${fileName}`);
}