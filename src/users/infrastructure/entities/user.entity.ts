import { Exclude, Expose } from "class-transformer";
import { AddressEntity } from "src/addresses/infrastructure/entities/address.entity";
import { AuthProvidersEnum } from "src/auth/auth-provider.enum";
import { OrderEntity } from "src/orders/infrastructure/entities/order.entity";
import { RoleEntity } from "src/roles/infrastructure/entities/role.entity";
import { StatusEntity } from "src/statuses/infrastructure/entities/status.entity";
import { EntityHelper } from "src/utils/entity-helper";
import { WishListEntity } from "src/wish-list/infrastructure/entities/wish-list.entity";
import {
  AfterLoad,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserImageEntity } from "./user-image.entity";

@Entity({
  name: "user",
})
export class UserEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String, unique: true, nullable: true })
  @Expose({ groups: ["me", "admin"] })
  email: string | null;

  @Column({ type: String, nullable: true })
  @Expose({ groups: ["me", "admin"] })
  phone: string | null;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password?: string;

  @Exclude({ toPlainOnly: true })
  public previousPassword?: string;

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password;
  }

  @Column({ default: AuthProvidersEnum.email })
  @Expose({ groups: ["me", "admin"] })
  provider: string;

  @Index()
  @Column({ type: String, nullable: true })
  @Expose({ groups: ["me", "admin"] })
  socialId?: string | null;

  @Index()
  @Column({ type: String, nullable: true })
  firstName: string | null;

  @Index()
  @Column({ type: String, nullable: true })
  lastName: string | null;

  @OneToOne(() => UserImageEntity, { cascade: true, eager: true })
  @JoinColumn()
  photo?: UserImageEntity | null;

  @ManyToOne(() => RoleEntity, {
    eager: true,
  })
  role?: RoleEntity | null;

  @ManyToOne(() => StatusEntity, {
    eager: true,
  })
  status?: StatusEntity;

  @OneToMany(() => AddressEntity, (address) => address.user, { cascade: true })
  addresses: AddressEntity[];

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];

  @OneToMany(() => WishListEntity, (wishlist) => wishlist.user)
  wishlist: WishListEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
