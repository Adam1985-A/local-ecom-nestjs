import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity.js';
import { CartItem } from './cart-item.entity.js';
import { AddToCartDto } from './dto/add-to-cart.dto.js';
import { UpdateCartItemDto } from './dto/update-cart-item.dto.js';
import { ProductsService } from '../products/products.service.js';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem) private readonly cartItemRepository: Repository<CartItem>,
    private readonly productsService: ProductsService,
  ) {}

  async getOrCreateCart(userId: string, vendorId: string): Promise<Cart> {
    let cart = await this.cartRepository.findOne({ 
      where: { userId, vendorId }, 

    relations: {
      items: {
        product: true,
      },
      vendor: true,
    }, 

  });

    if (!cart) { cart = await this.cartRepository.save(this.cartRepository.create({ userId, vendorId })); cart.items = []; }
    return cart;
  }

  getCart(userId: string): Promise<Cart[]> {
    return this.cartRepository.find({ 
      where: { userId }, 
      
      relations: {
        items: {
          product: true,
        },
        vendor: true,
      }, 

    });
  }

  async addItem(userId: string, dto: AddToCartDto): Promise<Cart> {

    const product = await this.productsService.findById(dto.productId);
    const cart = await this.getOrCreateCart(userId, dto.vendorId);
    let item = await this.cartItemRepository.findOne({ where: { cartId: cart.id, productId: dto.productId } });
    if (item) { 
      item.quantity += dto.quantity; item.unitPrice = product.effectivePrice;
     }

    else item = this.cartItemRepository.create({ cartId: cart.id, productId: dto.productId, quantity: dto.quantity, unitPrice: product.effectivePrice });

    await this.cartItemRepository.save(item);
    return this.getCartByIdOrThrow(cart.id);
  }

  async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto): Promise<Cart> {
    const item = await this.cartItemRepository.findOne({ 
      where: { id: itemId }, 
      
      relations: {
        cart: true,
      }, 
    
    });


    if (!item || item.cart.userId !== userId) 
      throw new NotFoundException('Cart item not found');
    if (dto.quantity === 0) await this.cartItemRepository.remove(item);
    else { item.quantity = dto.quantity; await this.cartItemRepository.save(item); }
    return this.getCartByIdOrThrow(item.cartId);
  }

  async clearCart(userId: string, vendorId: string): Promise<void> {
    const cart = await this.cartRepository.findOne({ where: { userId, vendorId } 
    });
    if (cart) await this.cartItemRepository.delete({ cartId: cart.id });
  }

  private async getCartByIdOrThrow(cartId: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({ 
      where: { id: cartId }, 
      
      relations: {
        items: {
          product: true,
        },
        vendor: true,
      } 
    
    });
    if (!cart) throw new NotFoundException('Cart not found');
    return cart;
  }
}
