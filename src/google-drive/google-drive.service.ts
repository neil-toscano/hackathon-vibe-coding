import { Injectable } from '@nestjs/common';
import { CreateGoogleDriveDto } from './dto/create-google-drive.dto';
import { UpdateGoogleDriveDto } from './dto/update-google-drive.dto';
import { google } from 'googleapis';
import * as fs from 'fs';

@Injectable()
export class GoogleDriveService {
  private folderId: string;
  private drive: any;
  private auth: any;
  constructor() {


    this.folderId = process.env.folder_id || 'BR5=';
    console.log(`ID de la carpeta: ${this.folderId}`);

    this.auth = new google.auth.JWT({
      email: process.env.client_email,
      key: process.env.private_key,
      scopes: ['https://www.googleapis.com/auth/drive']
    }
    );

    // Inicializar Drive API
    this.drive = google.drive({ version: 'v3', auth: this.auth });

  }

  async uploadFile(filePath: string, fileName: string, mimeType: string) {
    try {
      // Verificar que el archivo existe
      if (!fs.existsSync(filePath)) {
        throw new Error(`El archivo ${filePath} no existe.`);
      }

      // Configurar metadatos del archivo
      const fileMetadata = {
        name: fileName,
        parents: [this.folderId]
      };

      // Configurar el stream de datos
      const media = {
        mimeType: mimeType,
        body: fs.createReadStream(filePath)
      };

      // Subir el archivo a Drive
      const response = await this.drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id,webViewLink'
      });

      return {
        success: true,
        fileId: response.data.id,
        link: response.data.webViewLink,
        name: fileName
      };
    } catch (error) {
      console.error('Error al subir archivo a Google Drive:', error.message);
      throw error;
    }
  }

  create(createGoogleDriveDto: CreateGoogleDriveDto) {
    return 'This action adds a new googleDrive';
  }

  findAll() {
    return `This action returns all googleDrive`;
  }

  findOne(id: number) {
    return `This action returns a #${id} googleDrive`;
  }

  update(id: number, updateGoogleDriveDto: UpdateGoogleDriveDto) {
    return `This action updates a #${id} googleDrive`;
  }

  remove(id: number) {
    return `This action removes a #${id} googleDrive`;
  }
}
