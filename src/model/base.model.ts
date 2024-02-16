import { Table, Model, DataType, Default, Column } from 'sequelize-typescript';

@Table
export class BaseModel<T> extends Model<T> {
    @Default(() => Date.now())
    @Column({
      type: DataType.BIGINT,
      allowNull: false
    })
    createdAt: bigint;
  
    @Default(() => Date.now())
    @Column({
      type: DataType.BIGINT,
      allowNull: false
    })
    updatedAt: bigint; 

  // You can add other common fields or behaviors here
}