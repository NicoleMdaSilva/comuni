import { Injectable } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common/enums";
import { HttpException } from "@nestjs/common/exceptions";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, ILike, Repository } from "typeorm";
import { Produto } from "../entities/produto.entity";

/**
*  indica que a classe é do tipo Service (Classe de Serviço), 
*  que pode ser Injetada em outras Classes através da Injeção de Dependências.
*/ 
@Injectable()
export class ProdutoService {
    constructor(
        @InjectRepository(Produto)
        private produtoRepository: Repository<Produto>
    ) {}

/** 
* findAll - Esta função é um @Get está responsavel pela entrega de todos elementos
*/
    async findAll(): Promise<Produto[]>{
        return await this.produtoRepository.find({
           relations:{
            categoria: true
           }
        });
    }

/**
*findById() - Função @Get criada para vizualizar os elementos da tabela a partir do id
*/
    async finById(id: number): Promise<Produto>{
        let produto = await this.produtoRepository.findOne({
            where:{
                id
            },
            relations: {
                categoria: true
            }
        });

        if(!produto)
            throw new HttpException('Produto não encontrada!', HttpStatus.NOT_FOUND);
        return produto;
    }

/**
* findByName() - Função @Get criada para vizualizar os elementos da tabela a partir do nome
*/    
    async findByName(nome: string): Promise<Produto[]>{
        return await this.produtoRepository.find({
            where:{
                nome:ILike(`%${nome}%`)
            },
            relations: {
                categoria: true
            }
        })
    }

/**
* create - Função @Post para criar um elemento na tabela no corpo do Json (Body)
*/
    async create(produto: Produto): Promise<Produto>{
        return await this.produtoRepository.save(produto);
    }

/** 
* update - Função @Put para atualizar um elemento na tabela no corpo do Json (Body)
*/
    async update(produto: Produto): Promise<Produto>{
        let buscaProduto: Produto = await this.finById(produto.id);
        
        if(!buscaProduto || !produto.id)
            throw new HttpException('Produto não encontrado!', HttpStatus.NOT_FOUND);
        return await this.produtoRepository.save(produto);
        
    }

/**
* delete - É uma função @Delete para apagar um elemento pelo Id
*/
    async delete (id: number): Promise<DeleteResult>{
        let buscaProduto = await this.finById(id);

        if(!buscaProduto)
            throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);
        return await this.produtoRepository.delete(id);
    }
}