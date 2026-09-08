import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rider } from './rider.entity.js';
import { CreateRiderDto } from './dto/create-rider.dto.js';
import { UpdateRiderLocationDto } from './dto/update-rider-location.dto.js';
import { UpdateRiderStatusDto } from './dto/update-rider-status.dto.js';
import { RiderStatus } from '../common/enums/rider-status.enum.js';

@Injectable()
export class RidersService {
  constructor(@InjectRepository(Rider) private readonly riderRepository: Repository<Rider>) {}

  async create(userId: string, dto: CreateRiderDto): Promise<Rider> {
    if (await this.riderRepository.findOne({ where: { userId } })) throw new ConflictException('Rider profile already exists');
    return this.riderRepository.save(this.riderRepository.create({ ...dto, userId }));
  }

  

  async findById(id: string): Promise<Rider> {
    const rider = await this.riderRepository.findOne({ 
      where: { id }, 
      relations: {
        user: true,
        
        }
        
        });
    if (!rider) throw new NotFoundException('Rider not found');
    return rider;
  }

async findByUserId(userId: string): Promise<Rider> {
  const rider = await this.riderRepository.findOne({
    where: { userId },
    relations: {
      user: true,
    },
  });

  if (!rider) throw new NotFoundException('Rider not found');

  return rider;
}


  findAvailable(): Promise<Rider[]> { 
    return this.riderRepository.find({ where: { status: RiderStatus.AVAILABLE, isVerified: true }, 
      relations: {
        user: true, 
      } 
    }); 
  }

  async updateLocation(userId: string, dto: UpdateRiderLocationDto): Promise<Rider> {
    const rider = await this.findByUserId(userId);
    rider.currentLatitude = dto.latitude; rider.currentLongitude = dto.longitude;
    return this.riderRepository.save(rider);
  }

  async updateStatus(userId: string, dto: UpdateRiderStatusDto): Promise<Rider> {
    const rider = await this.findByUserId(userId);
    rider.status = dto.status;
    return this.riderRepository.save(rider);
  }

  async verify(id: string, isVerified: boolean): Promise<Rider> {
    const rider = await this.findById(id);
    rider.isVerified = isVerified;
    return this.riderRepository.save(rider);
  }

  async incrementDeliveryCount(riderId: string): Promise<void> {
    await this.riderRepository.increment({ id: riderId }, 'totalDeliveries', 1);
  }
}
