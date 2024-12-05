import { InjectRepository } from '@nestjs/typeorm';
import {
  BestSellingProducts,
  MonthlyRevenue,
} from 'src/analytics/domain/analytics';
import { ORDER_STATUS } from 'src/orders/orders.enum';
import { ProductEntity } from 'src/products/infrastructure/entities/product.entity';
import { StatusEnum } from 'src/statuses/statuses.enum';
import { NullableType } from 'src/utils/types/nullable.type';
import { DataSource, Repository } from 'typeorm';
import { AnalyticsRepository } from '../analytics.repository';

export class AnalyticsRepositoryImpl implements AnalyticsRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly dataSource: DataSource,
  ) {}
  async getBestSellingProducts(): Promise<NullableType<BestSellingProducts>> {
    const result = await this.dataSource.query(
      `
    SELECT 
        p.id,
        p.title,
        JSON_AGG(pi."imageUrl") AS images,
        p."sellPrice",
        p.quantity AS stock,
        COUNT(oi.id) AS "totalOrders",
        SUM(oi.quantity) AS "totalQuantity",
        SUM(oi.price) AS "totalRevenue"
    FROM 
        orders o
    JOIN 
        order_items oi ON o.id = oi."orderId"
    JOIN 
        product p ON oi."productId" = p.id
    LEFT JOIN 
        product_image pi ON pi."productId" = p.id
    WHERE 
        o.status = $1
    GROUP BY 
        p.id
    ORDER BY 
        "totalQuantity" DESC
    LIMIT 5;
  `,
      [ORDER_STATUS.COMPLETED],
    );

    return result
      ? result.map((item) => {
          const bestSellingProduct = new BestSellingProducts();
          bestSellingProduct.id = item.id;
          bestSellingProduct.title = item.title;
          bestSellingProduct.sellPrice = item.sellPrice;
          bestSellingProduct.images = item.images;
          bestSellingProduct.stock = item.stock;
          bestSellingProduct.totalRevenue = parseFloat(item.totalRevenue);
          bestSellingProduct.orders = item.totalOrders;
          bestSellingProduct.totalOrderdQuantity = item.totalQuantity;

          return bestSellingProduct;
        })
      : null;
  }

  async getMnthlyRevenue(): Promise<NullableType<MonthlyRevenue>> {
    const result = await this.dataSource.query(`
         SELECT 
        DATE_TRUNC('month', o."createdAt") AS month,
        SUM(o."totalAmount") AS revenue
    FROM orders o
    WHERE 
        o.status = 'COMPLETED' AND
        DATE_PART('year', o."createdAt") = DATE_PART('year', CURRENT_DATE)
    GROUP BY 
        month
    ORDER BY 
        month ASC;
            `);

    return result
      ? result.map((item) => {
          const monthlyRevenue = new MonthlyRevenue();
          monthlyRevenue.month = item.month;
          monthlyRevenue.revenue = parseFloat(item.revenue);
          return monthlyRevenue;
        })
      : null;
  }

  getTatalActiveUsers(): Promise<NullableType<number>> {
    return this.dataSource.query(
      `
      SELECT
        COUNT(u.id) as "activeUsers"
      FROM
        "user" u
      JOIN
        session s ON u.id = s."userId"
      WHERE
        s."updatedAt" > NOW() - INTERVAL '30 days'
        AND u."deletedAt" IS NULL
        AND u."statusId" = $1;
      `,
      [StatusEnum.active],
    );
  }

  getTotalOrders(): Promise<NullableType<number>> {
    return this.dataSource.query(
      `
      SELECT
        COUNT(o.id) as "totalOrders"
      FROM
        orders o
      WHERE
        o."status" = $1;
      `,
      [ORDER_STATUS.COMPLETED],
    );
  }

  getTotalProducts(): Promise<NullableType<number>> {
    return this.dataSource.query(
      `
      SELECT
        COUNT(p.id) as "totalProducts"
      FROM
        product p
      WHERE
        p."deletedAt" IS NULL;
      `,
    );
  }

  getTotalRevenue(): Promise<NullableType<number>> {
    return this.dataSource.query(
      `
      SELECT
        SUM(o."totalAmount") as "totalRevenue"
      FROM
        orders o
      WHERE
        o."status" = $1;
      `,
      [ORDER_STATUS.COMPLETED],
    );
  }
}
