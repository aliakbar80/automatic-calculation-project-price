import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PricingService } from './pricing.service';
import { CalculatePriceDto } from './dto/calculate-price.dto';

@ApiTags('pricing')
@Controller()
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Get('config')
  @ApiOperation({ summary: 'Get config lists: coefficients and base prices' })
  @ApiOkResponse({ description: 'Returns coefficients grouped by type and base prices' })
  getConfig(@Query('projectType') projectType?: string) {
    return this.pricingService.getConfig(projectType);
  }

  @Post('calculate')
  @ApiOperation({ summary: 'Calculate price with breakdown' })
  @ApiOkResponse({ description: 'Returns pricing breakdown and total' })
  calculate(@Body() dto: CalculatePriceDto) {
    return this.pricingService.calculate(dto);
  }
}
