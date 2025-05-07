import { PartialType } from '@nestjs/mapped-types';
import { CreateGoogleDriveDto } from './create-google-drive.dto';

export class UpdateGoogleDriveDto extends PartialType(CreateGoogleDriveDto) {}
