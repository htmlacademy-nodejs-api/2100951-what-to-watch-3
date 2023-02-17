export default class CreateUserDto {
    public email!: string;
  
    public avatarUrl!: File | undefined;
  
    public name!: string;
  
    public password!: string;
  }