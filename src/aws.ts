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
const s3 = new S3Client({
  region: "auto",
  endpoint: "https://4a9b58644a8fcb9c1695071e4ab7d7e6.r2.cloudflarestorage.com",
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY as string,
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

export async function uploadFile(
  fileName: string,
  localFilePath: string
): Promise<void> {
  const fileContent = await readFile(localFilePath);

  const command = new PutObjectCommand({
    Bucket: "build",
    Key: fileName,
    Body: fileContent
  });

  await s3.send(command);
  console.log(`Uploaded ${fileName}`);
}