import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity.js';
import { User } from '../users/user.entity.js';
import { RiderStatus } from '../common/enums/rider-status.enum.js';

@Entity('riders')
export class Rider extends BaseEntity {

  @Index({ unique: true }) 
  @Column({ name: 'user_id' }) 
  userId!: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'user_id' }) 
  user!: User;

  @Column({ name: 'vehicle_type' }) 
  vehicleType!: string;

  @Column({ name: 'vehicle_plate', nullable: true }) 
  vehiclePlate?: string;

  @Column({ type: 'enum', enum: RiderStatus, default: RiderStatus.OFFLINE }) 
  status!: RiderStatus;

  @Column({ name: 'current_latitude', type: 'decimal', precision: 10, scale: 7, nullable: true }) 
  currentLatitude?: number;

  @Column({ name: 'current_longitude', type: 'decimal', precision: 10, scale: 7, nullable: true }) 
  currentLongitude?: number;

  @Column({ name: 'is_verified', default: false }) 
  isVerified!: boolean;

  @Column({ name: 'total_deliveries', default: 0 }) 
  totalDeliveries!: number;

  @Column({ name: 'average_rating', type: 'decimal', precision: 3, scale: 2, default: 0 }) 
  averageRating!: number;

  @Column({ nullable: true }) 
  nin?: string;

  @Column({ name: 'guarantor_name', nullable: true }) 
  guarantorName?: string;

  @Column({ name: 'guarantor_phone', nullable: true }) 
  guarantorPhone?: string;
}
