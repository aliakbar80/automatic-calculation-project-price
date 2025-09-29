import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { MarketModule } from '../market/market.module';
import { PricingController } from './pricing.controller';
import { PricingService } from './pricing.service';
import { Coefficient } from './entities/coefficient.entity';
import { BasePrice } from './entities/base-price.entity';
import { seed } from './seed';

@Module({
  imports: [TypeOrmModule.forFeature([Coefficient, BasePrice]), MarketModule],
  controllers: [PricingController],
  providers: [PricingService]
})
export class PricingModule implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    await seed(this.dataSource);
  }
}
