import { ResponseUserDto } from '../../users/dto/response-user.dto';

export class AuthResponseDto {
  user: ResponseUserDto;
  accessToken: string;
}
