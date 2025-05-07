import { Module } from '@nestjs/common';
import { GoogleDriveService } from './google-drive.service';
import { GoogleDriveController } from './google-drive.controller';
import { MulterModule } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';

const uploadsDir = path.join(process.cwd(), 'uploads');
console.log(`Directorio de uploads: ${uploadsDir}`);

// Crear el directorio si no existe
if (!fs.existsSync(uploadsDir)) {
  console.log(`Creando directorio de uploads: ${uploadsDir}`);
  fs.mkdirSync(uploadsDir, { recursive: true });
}

@Module({
  imports: [
    MulterModule.register({
      dest: uploadsDir,
    })
  ],
  controllers: [GoogleDriveController],
  providers: [GoogleDriveService],
})
export class GoogleDriveModule {}
