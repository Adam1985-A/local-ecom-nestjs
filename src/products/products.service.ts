import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './products.entity.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { slugify } from '../common/utils/slug.util.js';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto.js';
import { paginate } from '../common/utils/pagination.util.js';
import type { PaginatedResult } from '../common/type/pagination.types.js';
import { UserRole } from '../common/enums/user.role.enum.js';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private readonly productRepository: Repository<Product>) {}

  async create(vendorId: string, dto: CreateProductDto): Promise<Product> {
    const slug = await this.makeUniqueSlug(slugify(dto.name), vendorId);
    return this.productRepository.save(this.productRepository.create({ ...dto, vendorId, slug }));
  }

  findAll(query: PaginationQueryDto & { vendorId?: string; categoryId?: string; minPrice?: number; maxPrice?: number }): Promise<PaginatedResult<Product>> {
    const qb = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.vendor', 'vendor').leftJoinAndSelect('product.category', 'category')
      .where('product.isActive = true').andWhere('vendor.status = :vs', { vs: 'approved' });
    if (query.vendorId) qb.andWhere('product.vendorId = :vid', { vid: query.vendorId });
    if (query.categoryId) qb.andWhere('product.categoryId = :cid', { cid: query.categoryId });
    if (query.minPrice !== undefined) qb.andWhere('product.price >= :min', { min: query.minPrice });
    if (query.maxPrice !== undefined) qb.andWhere('product.price <= :max', { max: query.maxPrice });
    if (query.search) qb.andWhere('(product.name ILIKE :s OR product.description ILIKE :s)', { s: `%${query.search}%` });
    qb.orderBy(query.sortBy === 'price' ? 'product.price' : 'product.createdAt', query.sortOrder ?? 'DESC');
    
      const options = {
  ...(query.page !== undefined && { page: query.page }),
  ...(query.limit !== undefined && { limit: query.limit }),
};

return paginate(qb, options);
  }

  findAllForVendor(vendorId: string, query: PaginationQueryDto): Promise<PaginatedResult<Product>> {
    const qb = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category').where('product.vendorId = :vendorId', { vendorId })
      .orderBy('product.createdAt', 'DESC');
    if (query.search) qb.andWhere('product.name ILIKE :s', { s: `%${query.search}%` });
    
    const options = {
  ...(query.page !== undefined && { page: query.page }),
  ...(query.limit !== undefined && { limit: query.limit }),
};

return paginate(qb, options);
  }

  async findById(id: string): Promise<Product> {
    const p = await this.productRepository.findOne({ 
      where: { id },

      relations: {
    vendor: true,
    category: true,
  },

      });
    if (!p) throw new NotFoundException('Product not found');
    return p;
  }

  async update(id: string, dto: UpdateProductDto, actorId: string, actorRole: UserRole): Promise<Product> {
    const product = await this.findById(id);
    this.assertOwnerOrAdmin(product, actorId, actorRole);
    if (dto.name && dto.name !== product.name) product.slug = await this.makeUniqueSlug(slugify(dto.name), product.vendorId, id);
    Object.assign(product, dto);
    return this.productRepository.save(product);
  }

  async remove(id: string, actorId: string, actorRole: UserRole): Promise<void> {
    const product = await this.findById(id);
    this.assertOwnerOrAdmin(product, actorId, actorRole);
    await this.productRepository.softRemove(product);
  }

  async updateRating(productId: string, avg: number, total: number): Promise<void> {
    await this.productRepository.update(productId, { averageRating: avg, totalReviews: total });
  }

  private async makeUniqueSlug(base: string, vendorId: string, excludeId?: string): Promise<string> {
    let slug = base; let counter = 0;
    while (true) {
      const qb = this.productRepository.createQueryBuilder('p').where('p.slug = :slug', { slug }).andWhere('p.vendorId = :vendorId', { vendorId });
      if (excludeId) qb.andWhere('p.id != :excludeId', { excludeId });
      if (!await qb.getOne()) break;
      slug = `${base}-${++counter}`;
    }
    return slug;
  }

  private assertOwnerOrAdmin(product: Product, actorId: string, actorRole: UserRole) {
    const isAdmin = [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(actorRole);
    if (!isAdmin && product.vendor?.userId !== actorId) throw new ForbiddenException('Permission denied');
  }
}
