import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';
import { v4 as uuid} from 'uuid';

@Injectable()
export class BrandsService {

  private brands: Brand[] = [
    {
      id: uuid(),
      name: 'Toyota',
      createdAt: new Date().getTime(),
    }
  ];

  create(createBrandDto: CreateBrandDto) {
    const brand: Brand = {
      id: uuid(),
      createdAt: new Date().getTime(),
      ...createBrandDto,
    };
    this.brands.push(brand)
    return brand;
  }

  findAll() {
    return this.brands;
  }

  findOne(id: string) {
    const brand = this.brands.find(brand => brand.id === id);
    if(!brand) 
      throw new NotFoundException(`Branch with ${id} not found`);

    return brand;
  }

  update(id: string, updateBrandDto: UpdateBrandDto) {
    let brandDb = this.findOne(id);
    this.brands = this.brands.map((brand) => {
      if (brand.id === id) {
        brandDb = Object.assign(brand, updateBrandDto, {updatedAt: new Date().getTime})
        return brandDb
      } else {
        return brand;
      }
    })
    return brandDb;
  }

  remove(id: string) {
    this.brands = this.brands.filter(brand => brand.id !== id)
  }

  fillBrandsWithSeedData(brands: Brand[]) {
    this.brands = brands
  }
}
