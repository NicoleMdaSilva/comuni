import { HttpStatus, Injectable } from "@nestjs/common";
import { HttpException } from "@nestjs/common/exceptions/http.exception";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, ILike, Repository } from "typeorm";
import { Categoria } from "../entities/categoria.entity";

/**
*  indica que a classe é do tipo Service (Classe de Serviço), 
*  que pode ser Injetada em outras Classes através da Injeção de Dependências.
*/ 
@Injectable()
export class categoriaService{
    constructor(
        @InjectRepository(Categoria)
        private categoriaRepository: Repository<Categoria>
    ) {}

/** 
* findAll - Esta função é um @Get está responsavel pela entrega de todos elementos
*/
    async findAll(): Promise<Categoria[]>{
        return await this.categoriaRepository.find();
    }

/**
 *findById() - Função @Get criada para vizualizar os elementos da tabela a partir do id
*/
    async findById(id: number): Promise<Categoria>{
        let categoria = await this.categoriaRepository.findOne({
            where:{
                id
            }
        });

        if(!categoria)
            throw new HttpException('Categoria não encontrada!', HttpStatus.NOT_FOUND)
        return categoria;
    }

/**
* findByName() - Função @Get criada para vizualizar os elementos da tabela a partir do nome
*/
    async findByName(categoria: string): Promise<Categoria[]>{
        return await this.categoriaRepository.find({
            where: {
                categoria: ILike(`%${categoria}%`)
            },
            relations: {
                produto: true
            }
        });
    }

/**
* create - Função @Post para criar um elemento na tabela no corpo do Json (Body)
*/
    async create(categoria: Categoria): Promise<Categoria>{
        return await this.categoriaRepository.save(categoria);
    }

/** 
* update - Função @Put para atualizar um elemento na tabela no corpo do Json (Body)
*/

    async update(categoria: Categoria): Promise<Categoria>{
        let buscaCategoria: Categoria = await this.findById(categoria.id)

        if(!buscaCategoria || !categoria.id)
            throw new HttpException('Categoria não encontrada!', HttpStatus.NOT_FOUND);
        return await this.categoriaRepository.save(categoria);
    }

/**
* delete - É uma função @Delete para apagar um elemento pelo Id
*/
    async delete(id: number): Promise<DeleteResult>{
        let buscaCategoria = await this.findById(id);

        if(!buscaCategoria)
            throw new HttpException('Categoria não encontrada', HttpStatus.NOT_FOUND);
        return await this.categoriaRepository.delete(id);
    }
}