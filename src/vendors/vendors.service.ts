import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from './vendor.entity.js';
import { CreateVendorDto } from './dto/create-vendor.dto.js';
import { UpdateVendorDto } from './dto/update-vendor.dto.js';
import { ReviewVendorDto } from './dto/review-vendor.dto.js';
import { VendorStatus } from '../common/enums/vendor-status.enum.js';
import { BusinessType } from '../common/enums/business-type.enum.js';
import { UserRole } from '../common/enums/user.role.enum.js';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto.js';
import { paginate } from '../common/utils/pagination.util.js';
import type { PaginatedResult } from '../common/type/pagination.types.js';

@Injectable()
export class VendorsService {
  constructor(@InjectRepository(Vendor) private readonly vendorRepository: Repository<Vendor>) {}

  async create(userId: string, dto: CreateVendorDto): Promise<Vendor> {
    const existing = await this.vendorRepository.findOne({ where: { userId } });
    if (existing) throw new ConflictException('You already have a vendor profile');
    return this.vendorRepository.save(this.vendorRepository.create({ ...dto, userId }));
  }

  findAll(query: PaginationQueryDto & { businessType?: BusinessType; status?: VendorStatus; city?: string }): Promise<PaginatedResult<Vendor>> {
    const qb = this.vendorRepository.createQueryBuilder('vendor').leftJoinAndSelect('vendor.user', 'user');
    if (query.search) qb.andWhere('(vendor.businessName ILIKE :s OR vendor.city ILIKE :s)', { s: `%${query.search}%` });
    if (query.businessType) qb.andWhere('vendor.businessType = :bt', { bt: query.businessType });
    if (query.status) qb.andWhere('vendor.status = :st', { st: query.status });
    if (query.city) qb.andWhere('vendor.city ILIKE :city', { city: `%${query.city}%` });
    qb.orderBy('vendor.createdAt', 'DESC');

    return paginate(qb, {
  ...(query.page !== undefined && { page: query.page }),
  ...(query.limit !== undefined && { limit: query.limit }),
   });
    }

  findAllActive(query: PaginationQueryDto & { businessType?: BusinessType; city?: string }): Promise<PaginatedResult<Vendor>> {
    const qb = this.vendorRepository.createQueryBuilder('vendor')
      .where('vendor.status = :st', { st: VendorStatus.APPROVED }).andWhere('vendor.isOpen = true');
    if (query.businessType) qb.andWhere('vendor.businessType = :bt', { bt: query.businessType });
    if (query.city) qb.andWhere('vendor.city ILIKE :city', { city: `%${query.city}%` });
    if (query.search) qb.andWhere('vendor.businessName ILIKE :s', { s: `%${query.search}%` });
    qb.orderBy('vendor.averageRating', 'DESC');

    return paginate(qb, {
  ...(query.page !== undefined && { page: query.page }),
  ...(query.limit !== undefined && { limit: query.limit }),
  });

  }

  async findById(id: string): Promise<Vendor> {
    const v = await this.vendorRepository.findOne({ 
      where: { id }, 
      relations: {
        user: true,
   
      } 
    });
    if (!v) throw new NotFoundException('Vendor not found');
    return v;
  }

  async findByUserId(userId: string): Promise<Vendor> {
    const v = await this.vendorRepository.findOne({ where: { userId } });
    if (!v) throw new NotFoundException('Vendor profile not found');
    return v;
  }

  async update(id: string, dto: UpdateVendorDto, actorId: string, actorRole: UserRole): Promise<Vendor> {
    const vendor = await this.findById(id);
    this.assertOwnerOrAdmin(vendor, actorId, actorRole);
    Object.assign(vendor, dto);
    return this.vendorRepository.save(vendor);
  }

  async review(id: string, dto: ReviewVendorDto): Promise<Vendor> {
    const vendor = await this.findById(id);
    vendor.status = dto.status;

    vendor.rejectionReason =
  dto.status === VendorStatus.REJECTED
    ? (dto.rejectionReason ?? null)
    : null;

    return this.vendorRepository.save(vendor);
  }

  async remove(id: string, actorId: string, actorRole: UserRole): Promise<void> {
    const vendor = await this.findById(id);
    this.assertOwnerOrAdmin(vendor, actorId, actorRole);
    await this.vendorRepository.softRemove(vendor);
  }

  async updateRating(vendorId: string, avg: number, total: number): Promise<void> {
    await this.vendorRepository.update(vendorId, { averageRating: avg, totalReviews: total });
  }

  private assertOwnerOrAdmin(vendor: Vendor, actorId: string, actorRole: UserRole) {
    const isAdmin = [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(actorRole);
    if (!isAdmin && vendor.userId !== actorId) throw new ForbiddenException('Permission denied');
  }
}