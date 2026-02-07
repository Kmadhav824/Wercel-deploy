import "dotenv/config";
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand
} from "@aws-sdk/client-s3";
import { pipeline } from "stream/promises";
import fs from "fs";
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
      Bucket: "deploy",
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
          Bucket: "deploy",
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
