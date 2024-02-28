import { Injectable, NotFoundException } from '@nestjs/common';
import { Car } from './interface/car.interface';
import {v4 as uuid} from 'uuid';
import { CreateCarDto, UpdateCarDto } from './dtos';

@Injectable()
export class CarsService {
  private cars: Car[] = [
    {
      id: uuid(),
      brand: 'Toyota',
      model: 'Corolla',
    },
    {
      id: uuid(),
      brand: 'Honda',
      model: 'Civic',
    },
    {
      id: uuid(),
      brand: 'Jeep',
      model: 'Cherokee',
    },
  ];

  findAll(): Car[] {
    return this.cars
  }

  findOneById(id: string): Car {
    const car = this.cars.find(c => c.id === id)
    if (!car)
      throw new NotFoundException(`Car with id "${id}" not found`)

    return car
  }

  create(createCarDto: CreateCarDto): Car {
    const newCar: Car = {
      id: uuid(),
      ...createCarDto,
    };

    this.cars.push(newCar)
    return newCar;
  }

  update(id: string, updateCarDto: UpdateCarDto): Car {
    let carDb = this.findOneById(id);
    this.cars = this.cars.map((car) => {
      if (car.id === id) {
        carDb = Object.assign(car, updateCarDto, {id}) as Car
        return carDb
      } else {
        return car
      }
    })
    return carDb;
  }

  delete(id: string): Car {
    const carDb = this.findOneById(id);
    this.cars = this.cars.filter(c => c.id !== id)
    return carDb;
  }

  fillCarsWithSeedData( cars: Car[] ) {
    this.cars = cars
  }
}
