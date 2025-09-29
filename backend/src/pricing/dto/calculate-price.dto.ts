import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ProjectType {
  WebApp = 'webapp',
  Shop = 'shop',
  ERP = 'erp',
  Landing = 'landing',
  CMS = 'cms',
  CRM = 'crm',
  Mobile = 'mobile',
  SaaS = 'saas',
}

export enum ProjectScale {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

export enum DeliverySpeed {
  Normal = 'normal',
  Fast = 'fast',
  Urgent = 'urgent',
}

export class CalculatePriceDto {
  @ApiProperty({ enum: ProjectType })
  @IsEnum(ProjectType)
  projectType!: ProjectType;

  @ApiProperty({ enum: ProjectScale })
  @IsEnum(ProjectScale)
  scale!: ProjectScale;

  @ApiProperty({ type: [String], example: ['react', 'nextjs', 'nestjs'] })
  @IsArray()
  @IsString({ each: true })
  technologies!: string[]; // e.g., ['react','nextjs','nestjs']

  @ApiProperty({ minimum: 0, example: 8 })
  @IsNumber()
  @Min(0)
  pagesOrModules!: number;

  @ApiProperty({ type: [String], example: ['live_chat', 'i18n'] })
  @IsArray()
  @IsString({ each: true })
  specialFeatures!: string[]; // e.g., ['live_chat','i18n','ai']

  @ApiProperty({ enum: DeliverySpeed })
  @IsEnum(DeliverySpeed)
  delivery!: DeliverySpeed;

  @ApiProperty({ minimum: 1, maximum: 3, example: 2 })
  @IsNumber()
  @Min(1)
  @Max(3)
  complexity!: number; // 1 low, 2 medium, 3 high

  @ApiProperty({ minimum: 1, maximum: 3, example: 2 })
  @IsNumber()
  @Min(1)
  @Max(3)
  risk!: number; // 1 low, 2 medium, 3 high

  @ApiProperty({ example: 600000, required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => (value === '' || value === null || typeof value === 'undefined' ? undefined : value))
  @Type(() => Number)
  usdRate?: number; // If omitted, fetched live


  @ApiProperty({ minimum: 0, example: 0.25 })
  @IsNumber()
  @Min(0)
  profitMargin!: number; // e.g., 0.25 for 25%
}

export type PriceBreakdown = {
  baseUsd: number;
  baseIrr: number;
  inflationApplied: number;
  deliveryMultiplier: number;
  complexityMultiplier: number;
  riskMultiplier: number;
  technologiesMultiplier: number;
  featuresMultiplier: number;
  modulesMultiplier: number;
  subtotal: number;
  profitAmount: number;
  total: number;
};


