import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class PokemonService {

  constructor (
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
      return await this.pokemonModel.create(createPokemonDto);
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async createMany(newPokemons: CreatePokemonDto[]): Promise<Pokemon[]> {
    try {
      return await this.pokemonModel.insertMany(newPokemons);
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<Pokemon[]> {
    const {limit = 10, offset = 0} = paginationDto;
    return this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({
        no: 1,
      })
      .select('-__v');
  }

  async findOne(term: string): Promise<Pokemon> {
    let pokemon: Pokemon;
    if (!Number.isNaN(+term))
      pokemon = await this.pokemonModel.findOne({ no: term });
    else if (isValidObjectId(term))
      pokemon = await this.pokemonModel.findById(term);
    else
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase() });

    if (!pokemon)
      throw new NotFoundException(`Pokemon with id, name or no "${term}" not found`);
    return pokemon;
  }

  async update(
    term: string,
    updatePokemonDto: UpdatePokemonDto,
  ): Promise<Pokemon> {
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();

    try {
      return await this.pokemonModel.findByIdAndUpdate(
        pokemon.id,
        updatePokemonDto,
        {new: true},
      );
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async remove(id: string): Promise<void> {
    const {deletedCount} = await this.pokemonModel.deleteOne({_id: id});
    if (deletedCount === 0)
      throw new BadRequestException(`Pokemon with id "${id}" not found`);
  }

  private handleExceptions(error: any) {
    if (error.code === 11000 )
      throw new BadRequestException(
        `Pokemon exists in db ${JSON.stringify(error.keyValue)}`
      );

    console.log(error);
    throw new InternalServerErrorException(`Can't create pokemon - Verify server logs`);
  }
}
