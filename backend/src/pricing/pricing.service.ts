import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BasePrice } from './entities/base-price.entity';
import { Coefficient } from './entities/coefficient.entity';
import { CalculatePriceDto, DeliverySpeed, PriceBreakdown, ProjectScale, ProjectType } from './dto/calculate-price.dto';
import { MarketService } from '../market/market.service';

@Injectable()
export class PricingService {
  constructor(
    @InjectRepository(BasePrice)
    private readonly basePriceRepo: Repository<BasePrice>,
    @InjectRepository(Coefficient)
    private readonly coefficientRepo: Repository<Coefficient>,
    private readonly marketService: MarketService,
  ) {}

  async getConfig(projectType?: string) {
    const [coeffs, basePrices] = await Promise.all([
      this.coefficientRepo.find(),
      this.basePriceRepo.find(projectType ? { where: { projectType } } : {}),
    ]);
    const grouped: Record<string, Coefficient[]> = {};
    for (const c of coeffs) {
      grouped[c.group] = grouped[c.group] || [];
      grouped[c.group].push(c);
    }
    // Apply simple relevance filtering for technologies/features by projectType
    if (projectType) {
      const tech = grouped['technology'] || [];
      const feature = grouped['feature'] || [];
      const techFilter = this.getTechFilter(projectType);
      const featureFilter = this.getFeatureFilter(projectType);
      grouped['technology'] = tech.filter((t) => techFilter.has(t.key));
      grouped['feature'] = feature.filter((f) => featureFilter.has(f.key));
    }
    return { coefficients: grouped, basePrices };
  }

  private getTechFilter(projectType: string): Set<string> {
    const common = new Set<string>(['vanilla_js','react','nextjs','nestjs','node','rest','graphql','postgres','mysql','mongodb','redis','docker','tailwind','testing']);
    const maps: Record<string, string[]> = {
      webapp: ['vanilla_js','react','nextjs','nestjs','node','graphql','rest','postgres','mysql','mongodb','redis','docker','tailwind','testing'],
      shop: ['vanilla_js','nextjs','react','wordpress','woocommerce','magento','shopify','prestashop','opencart','nestjs','node','postgres','mysql','redis','docker','tailwind'],
      erp: ['nestjs','node','postgres','redis','docker','kafka','rabbitmq','rest','graphql','testing'],
      landing: ['vanilla_js','nextjs','react','tailwind'],
      cms: ['vanilla_js','wordpress','woocommerce','drupal','joomla','strapi','ghost','directus','keystone','sanity','contentful','nextjs','react','nestjs','postgres','mysql','docker'],
      crm: ['nestjs','node','postgres','redis','docker','graphql','rest'],
      mobile: ['react_native','flutter','nestjs','node','graphql','rest'],
      saas: ['nextjs','react','nestjs','node','postgres','redis','docker','graphql','rest','kubernetes'],
    };
    return new Set(maps[projectType] || Array.from(common));
  }

  private getFeatureFilter(projectType: string): Set<string> {
    const common = new Set<string>(['auth','rbac','notifications','seo','reporting','analytics','admin_panel']);
    const maps: Record<string, string[]> = {
      webapp: ['auth','rbac','notifications','seo','blog','reporting','analytics','admin_panel','i18n','pwa'],
      shop: ['auth','rbac','notifications','payment','shipping','inventory','invoice','reporting','analytics','admin_panel','i18n'],
      erp: ['auth','rbac','reporting','invoice','queue','cache','admin_panel'],
      landing: ['seo','analytics','blog'],
      cms: ['auth','rbac','seo','cms','admin_panel','i18n'],
      crm: ['auth','rbac','notifications','reporting','admin_panel','email','sms'],
      mobile: ['auth','notifications','pwa','offline','realtime'],
      saas: ['auth','rbac','subscription','billing','reporting','analytics','admin_panel','webhook','multi_tenant'],
    } as any;
    return new Set(maps[projectType] || Array.from(common));
  }

  async calculate(dto: CalculatePriceDto): Promise<PriceBreakdown> {
    const base = await this.basePriceRepo.findOneBy({
      projectType: dto.projectType,
      scale: dto.scale,
    });
    if (!base) {
      throw new Error('Base price not configured for given type/scale');
    }

    const fetchCoeff = async (group: string, key: string, fallback = 1) => {
      const found = await this.coefficientRepo.findOne({ where: { group, key } });
      return found?.value ?? fallback;
    };

    const deliveryMultiplier = await fetchCoeff('delivery', dto.delivery, 1);
    const complexityMultiplier = await fetchCoeff('complexity', String(dto.complexity), 1);
    const riskMultiplier = await fetchCoeff('risk', String(dto.risk), 1);

    let technologiesMultiplier = 1;
    for (const tech of dto.technologies) {
      const v = await fetchCoeff('technology', tech, 1);
      technologiesMultiplier *= v;
    }
    // Cap effect so stacking too many techs won't explode
    technologiesMultiplier = Math.min(technologiesMultiplier, 1.25);

    let featuresMultiplier = 1;
    for (const f of dto.specialFeatures) {
      const v = await fetchCoeff('feature', f, 1);
      featuresMultiplier *= v;
    }
    featuresMultiplier = Math.min(featuresMultiplier, 1.35);

    const modulesMultiplier = 1 + Math.max(0, dto.pagesOrModules - 5) * 0.03; // soften extra module impact

    const baseUsd = base.baseUsd;
    const usdRate = dto.usdRate ?? (await this.marketService.getUsdToIrr());
    const baseIrr = baseUsd * usdRate;
    // Prorate inflation by duration: annual multiplier -> monthly effective factor
    const inflationApplied = baseIrr; // inflation removed per request
    const subtotal =
      inflationApplied *
      deliveryMultiplier *
      complexityMultiplier *
      riskMultiplier *
      technologiesMultiplier *
      featuresMultiplier *
      modulesMultiplier;
    const profitAmount = subtotal * dto.profitMargin;
    const total = subtotal + profitAmount;

    return {
      baseUsd,
      baseIrr,
      inflationApplied,
      deliveryMultiplier,
      complexityMultiplier,
      riskMultiplier,
      technologiesMultiplier,
      featuresMultiplier,
      modulesMultiplier,
      subtotal,
      profitAmount,
      total,
    };
  }
}
