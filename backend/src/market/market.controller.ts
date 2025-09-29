import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MarketService } from './market.service';

@ApiTags('market')
@Controller('market')
export class MarketController {
  constructor(private readonly market: MarketService) {}

  @Get('usd')
  @ApiOkResponse({ description: 'USD to IRR rate (approx)' })
  usd() {
    return this.market.getUsdToIrr().then((rate) => ({ rate }));
  }

  @Get('inflation')
  @ApiOkResponse({ description: 'Annual inflation multiplier' })
  inflation() {
    return this.market.getAnnualInflation().then((multiplier) => ({ multiplier }));
  }
}
