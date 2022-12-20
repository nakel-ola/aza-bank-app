import { Bucket, Storage } from "@google-cloud/storage";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { join } from "path";
import { FileUpload } from "src/modules/user/interface/file-upload.interface";
import { format } from "util";

@Injectable()
export class CloudStorageService {
  private bucket: Bucket;
  private storage: Storage;

  constructor(private config: ConfigService) {
    this.storage = new Storage({
      keyFilename: join(__dirname, this.config.get("STORAGE_CREDENTIALS_PATH")),
      projectId: this.config.get("STORAGE_PROJECT_ID"),
    });
    this.bucket = this.storage.bucket(this.config.get("STORAGE_BUCKET_NAME"));
  }

  async uploadFile({ createReadStream, filename }: FileUpload): Promise<any> {
    return new Promise((resolve, reject) => {
      const blob = this.bucket.file(filename);
      const stream = createReadStream();

      stream
        .pipe(
          this.bucket.file(filename).createWriteStream({
            resumable: false,
            gzip: true,
          })
        )
        .on("error", (err: any) => reject(err)) // reject on error
        .on("finish", async () => {
          const publicUrl = format(
            `https://storage.googleapis.com/${this.bucket.name}/${blob.name}`
          );

          try {
            await this.bucket.file(filename).makePublic();
          } catch {
            console.log(
              `Uploaded the file successfully: ${filename}, but public access is denied!`
            );
          }
          resolve(publicUrl);
        });
    });
  }

  async removeFile(url: string): Promise<void> {
    const fileName = url.split('https://storage.googleapis.com/aza-bank.appspot.com/')[1];
    const file = this.bucket.file(fileName);
    try {
      await file.delete();
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }
}
