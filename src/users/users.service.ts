import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity.js';
import { UserRole } from '../common/enums/user.role.enum.js';
import { hashValue } from '../common/utils/hash.util.js';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto.js';
import { paginate } from '../common/utils/pagination.util.js';
import type { PaginatedResult } from '../common/type/pagination.types.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UpdateUserStatusDto } from './dto/update-user-status.dto.js';
import { UpdateUserRoleDto } from './dto/update-user.role.dto.js';

export interface CreateUserInput {
  email: string; 
  password: string; 
  firstName: string; 
  lastName: string; 
  phone?: string; 
  role?: UserRole;
}

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

async create(input: CreateUserInput): Promise<User> {
    const existing = await this.usersRepository.findOne({ 
      where: {

      email: input.email.toLowerCase() 
    } 
  });

    if (existing) throw new ConflictException('A user with this email already exists');
    const user = this.usersRepository.create({
      ...input, email: input.email.toLowerCase(),
      password: await hashValue(input.password),
      role: input.role ?? UserRole.CUSTOMER,
    });
    return this.usersRepository.save(user);
  }

  findAll(query: PaginationQueryDto): Promise<PaginatedResult<User>> {
    const qb = this.usersRepository.createQueryBuilder('user');
    if (query.search) {
      qb.andWhere('(user.email ILIKE :s OR user.firstName ILIKE :s OR user.lastName ILIKE :s)', { s: `%${query.search}%` });
    }
    qb.orderBy(`user.${query.sortBy ?? 'createdAt'}`, query.sortOrder ?? 'DESC');

    return paginate(qb, {
  ...(query.page !== undefined && { page: query.page }),
  ...(query.limit !== undefined && { limit: query.limit }),

  });
   }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepository.createQueryBuilder('user')
      .addSelect(['user.password', 'user.refreshTokenHash'])
      .where('user.email = :email', { email: email.toLowerCase() }).getOne();
  }

  findByIdWithRefreshToken(id: string): Promise<User | null> {
    return this.usersRepository.createQueryBuilder('user')
      .addSelect('user.refreshTokenHash').where('user.id = :id', { id }).getOne();
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, dto);
    return this.usersRepository.save(user);
  }

  async updateStatus(id: string, dto: UpdateUserStatusDto): Promise<User> {
    const user = await this.findById(id);
    user.isActive = dto.isActive;
    return this.usersRepository.save(user);
  }

  async updateRole(id: string, dto: UpdateUserRoleDto): Promise<User> {
    const user = await this.findById(id);
    user.role = dto.role;
    return this.usersRepository.save(user);
  }

  async updateRefreshTokenHash(id: string, token: string | null): Promise<void> {
    if (token === null) {
      await this.usersRepository.createQueryBuilder().update(User)
        .set({ refreshTokenHash: () => 'NULL' }).where('id = :id', { id }).execute();
    } else {
      await this.usersRepository.update(id, { refreshTokenHash: token });
    }
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    await this.usersRepository.update(id, { password: hashedPassword });
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.usersRepository.softRemove(user);
  }
}