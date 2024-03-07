import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  async create(@Body() createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
    return this.pokemonService.create(createPokemonDto);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto): Promise<Pokemon[]> {
    return this.pokemonService.findAll(paginationDto);
  }

  @Get(':term')
  async findOne(@Param('term') term: string): Promise<Pokemon> {
    return this.pokemonService.findOne(term);
  }

  @Patch(':term')
  async update(
    @Param('term') term: string,
    @Body() updatePokemonDto: UpdatePokemonDto,
  ): Promise<Pokemon> {
    return this.pokemonService.update(term, updatePokemonDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseMongoIdPipe) id: string): Promise<void> {
    await this.pokemonService.remove(id);
  }
}
