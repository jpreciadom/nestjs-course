import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { AxiosAdapter } from 'src/common/adapters/http-adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    private readonly axiosAdapter: AxiosAdapter,
    private readonly pokemonService: PokemonService,
  ) {}

  async executeSeed() {
    const {results} = await this.axiosAdapter.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650'
    );

    const newPokemons: CreatePokemonDto[] = results.map(({name, url}) => {
      const urlSegments = url.split('/')
      const no = +urlSegments[urlSegments.length - 2];

      return {
        name: name.toLocaleLowerCase(),
        no,
      };
    });
    await this.pokemonService.createMany(newPokemons);

    return 'Seed executed';
  }
}
