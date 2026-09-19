import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity.js';
import { BusinessType } from '../common/enums/business-type.enum.js';

@Entity('categories')
export class Category extends BaseEntity {

  @Column({ type: 'varchar' })
  name!: string;

  
  @Column({ type: 'varchar' }) 
  slug!: string;

  @Column({ nullable: true, type: 'text' }) 
  description?: string;

  @Column({ name: 'icon_url', type: 'varchar', nullable: true }) 
  iconUrl?: string;

  @Column({ name: 'business_type', type: 'enum', enum: BusinessType }) 
  businessType!: BusinessType;

  @Column({ name: 'parent_id', type: 'uuid', nullable: true }) 
  parentId?: string;

  @ManyToOne(() => Category, (c) => c.children, { nullable: true, onDelete: 'SET NULL' }) @JoinColumn({ name: 'parent_id' }) 
  parent?: Category;

  @OneToMany(() => Category, (c) => c.parent) 
  children!: Category[];

  @Column({ name: 'sort_order', type: 'int', default: 0 }) 
  sortOrder!: number;

  @Column({ name: 'is_active', type: 'boolean', default: true }) 
  isActive!: boolean;
}
