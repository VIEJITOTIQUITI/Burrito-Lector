import { Controller, Get, UseGuards } from '@nestjs/common';
import { AffinityService, AffinityResult } from './affinity.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ResponseUserDto } from '../users/dto/response-user.dto';

@Controller('affinity')
export class AffinityController {
  constructor(private readonly affinityService: AffinityService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAffinity(
    @CurrentUser() currentUser: ResponseUserDto,
  ): Promise<{ data: AffinityResult[] }> {
    const results = await this.affinityService.getAffinityForUser(
      currentUser.id,
    );
    return { data: results };
  }
}
