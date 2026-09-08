import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Inventory } from './inventory.entity.js';
import { CreateInventoryDto } from './dto/create-inventory.dto.js';
import { AdjustInventoryDto, AdjustmentType } from './dto/adjust-inventory.dto.js';
import { UpdateInventoryDto } from './dto/update-inventory.dto.js';
import { BusinessException } from '../common/exception/business.exception.js';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory) private readonly inventoryRepository: Repository<Inventory>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateInventoryDto): Promise<Inventory> {
    if (await this.inventoryRepository.findOne({ where: { productId: dto.productId } }))
      throw new ConflictException('Inventory record already exists for this product');
    return this.inventoryRepository.save(this.inventoryRepository.create(dto));
  }

  async findByProductId(productId: string): Promise<Inventory> {
    const inv = await this.inventoryRepository.findOne({ 
      where: { productId },

      relations: {
      product: true,
    },

    });
    if (!inv) throw new NotFoundException('Inventory record not found');
    return inv;
  }

  async findById(id: string): Promise<Inventory> {
    const inv = await this.inventoryRepository.findOne({ 
      where: { id }, 

      relations: {
        product: true,
       },


    });
    if (!inv) throw new NotFoundException('Inventory record not found');
    return inv;
  }

  async adjust(productId: string, dto: AdjustInventoryDto): Promise<Inventory> {
    return this.dataSource.transaction(async (manager) => {
      const inv = await manager.getRepository(Inventory).createQueryBuilder('inv')
        .setLock('pessimistic_write').where('inv.productId = :productId', { productId }).getOne();
      if (!inv) throw new NotFoundException('Inventory record not found');
      if (inv.isUnlimited) return inv;
      let newQty: number;
      switch (dto.type) {
        case AdjustmentType.RESTOCK: newQty = inv.quantity + dto.quantity; break;
        case AdjustmentType.DEDUCT:
          newQty = inv.quantity - dto.quantity;
          if (newQty < 0) throw new BusinessException(`Insufficient stock. Available: ${inv.quantity}`);
          break;
        default: newQty = dto.quantity;
      }
      inv.quantity = newQty;
      return manager.getRepository(Inventory).save(inv);
    });
  }

  async deductStock(items: Array<{ productId: string; quantity: number }>): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      for (const item of items) {
        const inv = await manager.getRepository(Inventory).createQueryBuilder('inv')
          .setLock('pessimistic_write').where('inv.productId = :productId', { productId: item.productId }).getOne();
        if (!inv || inv.isUnlimited) continue;
        if (inv.quantity < item.quantity)
          throw new BusinessException(`Insufficient stock for product ${item.productId}. Available: ${inv.quantity}, Requested: ${item.quantity}`);
        inv.quantity -= item.quantity;
        await manager.getRepository(Inventory).save(inv);
      }
    });
  }

  async restoreStock(items: Array<{ productId: string; quantity: number }>): Promise<void> {
    for (const item of items) {
      await this.inventoryRepository.createQueryBuilder().update(Inventory)
        .set({ quantity: () => `quantity + ${item.quantity}` })
        .where('productId = :productId', { productId: item.productId }).execute();
    }
  }

  async update(id: string, dto: UpdateInventoryDto): Promise<Inventory> {
    const inv = await this.findById(id);
    Object.assign(inv, dto);
    return this.inventoryRepository.save(inv);
  }

  findLowStock(vendorId?: string): Promise<Inventory[]> {
    const qb = this.inventoryRepository.createQueryBuilder('inv').leftJoinAndSelect('inv.product', 'product')
      .where('inv.isUnlimited = false').andWhere('inv.quantity <= inv.lowStockThreshold').andWhere('inv.lowStockThreshold > 0');
    if (vendorId) qb.andWhere('product.vendorId = :vendorId', { vendorId });
    return qb.getMany();
  }
}
