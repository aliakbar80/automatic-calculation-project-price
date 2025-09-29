import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MarketService {
  constructor(private readonly http: HttpService) {}

  async getUsdToIrr(): Promise<number> {
    // Example free API placeholder. Replace with a reliable local source as needed.
    try {
      const resp = await firstValueFrom(this.http.get('https://open.er-api.com/v6/latest/USD'));
      const irr = resp.data?.rates?.IRR;
      if (irr && typeof irr === 'number') return irr;
    } catch (e) {}
    // Fallback to a safe default or internal config
    return 600000; // IRR per USD
  }

  async getAnnualInflation(): Promise<number> {
    // Placeholder: try to fetch CPI-based YoY inflation. If unavailable, fallback.
    try {
      // Example: public dataset stub
      // const resp = await firstValueFrom(this.http.get('https://api.example.com/inflation/iran'));
      // return Number(resp.data?.annualMultiplier ?? 1.35);
    } catch (e) {}
    return 1.35;
  }
}
