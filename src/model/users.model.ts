import { Column, Table } from 'sequelize-typescript';
import { BaseModel } from "./base.model";

@Table
export class users extends BaseModel<users> {
  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column
  email: string;

  @Column
  hashPassword: string;

  @Column({ defaultValue: true })
  isActive: boolean; 
}