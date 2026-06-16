import { Role } from '../../common/enums/role.enum';

export class ResponseUserDto {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
