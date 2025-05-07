import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { GoogleDriveService } from './google-drive.service';
import { CreateGoogleDriveDto } from './dto/create-google-drive.dto';
import { UpdateGoogleDriveDto } from './dto/update-google-drive.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

@Controller('google-drive')
export class GoogleDriveController {
  constructor(private readonly googleDriveService: GoogleDriveService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          // Generar un nombre de archivo único
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file) {
    if (!file) {
      throw new BadRequestException('No se proporcionó un archivo válido');
    }

    try {
      // Subir el archivo a Google Drive
      const result = await this.googleDriveService.uploadFile(
        file.path,
        file.originalname,
        file.mimetype
      );

      // Eliminar el archivo temporal después de subirlo a Drive
      fs.unlinkSync(file.path);

      return {
        success: true,
        message: 'Archivo subido correctamente a Google Drive',
        file: {
          name: file.originalname,
          size_bytes: file.size,
          file_extension: file.mimetype,
          status: 'active',
          description: 'Archivo subido a Google Drive',
        },
        drive_info: {
          folder_id: result.fileId,
          folder_path: result.link
        }
      };
    } catch (error) {
      // Si hay un error, también eliminar el archivo temporal si existe
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      
      throw new BadRequestException(`Error al subir archivo: ${error.message}`);
    }
  }

  @Get()
  findAll() {
    return this.googleDriveService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.googleDriveService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGoogleDriveDto: UpdateGoogleDriveDto) {
    return this.googleDriveService.update(+id, updateGoogleDriveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.googleDriveService.remove(+id);
  }
}
