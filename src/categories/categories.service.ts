import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { slugify } from '../common/utils/slug.util.js';
import { BusinessType } from '../common/enums/business-type.enum.js';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private readonly repo: Repository<Category>) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const slug = slugify(dto.name);
    if (await this.repo.findOne({ where: { slug } })) throw new ConflictException(`Slug "${slug}" already exists`);
    return this.repo.save(this.repo.create({ ...dto, slug }));
  }

  findAll(businessType?: BusinessType): Promise<Category[]> {
    const qb = this.repo.createQueryBuilder('c').leftJoinAndSelect('c.children', 'ch')
      .where('c.parentId IS NULL').andWhere('c.isActive = true');
    if (businessType) qb.andWhere('c.businessType = :bt', { bt: businessType });
    return qb.orderBy('c.sortOrder', 'ASC').addOrderBy('c.name', 'ASC').getMany();
  }

  async findById(id: string): Promise<Category> {
    const c = await this.repo.findOne({ 
      where: { id },

      relations: {
        parent: true, 
        children: true, 

      }

    });
    if (!c) throw new NotFoundException('Category not found');
    return c;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const cat = await this.findById(id);
    if (dto.name && dto.name !== cat.name) {
      const slug = slugify(dto.name);
      const ex = await this.repo.findOne({ where: { slug } });
      if (ex && ex.id !== id) throw new ConflictException(`Slug "${slug}" in use`);
      cat.slug = slug;
    }
    Object.assign(cat, dto);
    return this.repo.save(cat);
  }

  async remove(id: string): Promise<void> { 
    await this.repo.softRemove(await this.findById(id)); 
  }
}



