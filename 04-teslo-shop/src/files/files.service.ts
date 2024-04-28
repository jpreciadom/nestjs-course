import { Injectable, NotFoundException } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
    getStaticProductImagePath(imageName: string) {
        const path = join(__dirname, '../../statics/products', imageName)
        if ( !existsSync(path) ) {
            throw new NotFoundException(`Not product image found with name ${imageName}`)
        }

        return path
    }
}
