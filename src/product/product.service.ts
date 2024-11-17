import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import * as fs from 'fs';
import { join } from 'path';
import { unlink } from 'fs/promises';

@Injectable()
export class ProductService implements OnModuleInit {
  private readonly uploadsPath = join(__dirname, '..', '..', 'uploads');
  private readonly initialData = join(__dirname, '..', '..', 'init-data.json');

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  create(product: Partial<Product>) {
    return this.productRepository.save(product);
  }

  findAll(query: any) {
    const { page = 1, limit = 10, sortBy, filterBy } = query;
    const qb = this.productRepository.createQueryBuilder('product');

    if (filterBy) {
      qb.where('product.name ILIKE :name', { name: `%${filterBy}%` });
    }

    if (sortBy) {
      qb.orderBy('product.price', sortBy.toUpperCase());
    }

    qb.skip((page - 1) * limit).take(limit);

    return qb.getManyAndCount();
  }

  findOne(id: number) {
    return this.productRepository.findOne({ where: { id } });
  }

  update(id: number, product: Partial<Product>) {
    return this.productRepository.update(id, product);
  }

  remove(id: number) {
    return this.productRepository.delete(id);
  }

  async onModuleInit() {
    const count = await this.productRepository.count();
    if (count === 0) {
      console.log('Loading initial data...');

      const initialData = JSON.parse(
        await fs.promises.readFile(this.initialData, 'utf-8'),
      );
      await this.productRepository.save(initialData);
      console.log('Initial data has been added!');
    }
  }
  async deletePhoto(id: string): Promise<string> {
    const fileName = (await this.findOne(+id)).photo;
    const filePath = join(this.uploadsPath, fileName);

    try {
      await fs.promises.access(filePath, fs.constants.F_OK);

      await unlink(filePath);
      await this.update(+id, { photo: null });
      return `File ${fileName} deleted successfully.`;
    } catch (error) {
      throw new Error(
        `Error deleting file: ${fileName}. Error: ${error.message}`,
      );
    }
  }
}
