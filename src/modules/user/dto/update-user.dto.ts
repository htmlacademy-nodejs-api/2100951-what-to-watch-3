import { IsOptional, Validate, IsString, Length } from 'class-validator';
import { CustomAvatar } from '../../../utils/custom-avatar.js';

export default class UpdateUserDto {
  @IsOptional()
  @Validate(CustomAvatar, { message: 'avatarUrl field must be a link on .jpg or .png format' })
  public avatarPath?: string;

  @IsOptional()
  @IsString({ message: 'name is string' })
  @Length(1, 15, { message: 'Min length is 1, max is 15' })
  public name?: string;
}
