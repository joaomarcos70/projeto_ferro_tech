const knex = require('../database/connection');

class Venda {

    async findNotas(){
        try{
            const notas = await knex.select('*').table('nota').where({tipo_nota: 2});
            return notas;
        }catch(err){
            console.log(err);
        }
    }

    async findMaterials(cod_nota){
        try{
            const materiais = await knex.select('*').table('venda_material').where({cod_nota: cod_nota});
            return materiais;
        }catch(err){
            console.log(err);
        }
    }

    async createNota(materiais ,totalPagar){
        try{
            const result = await knex.transaction(async trx => {
                const id = await knex.insert({numero_nota: 1, total: totalPagar,data_nota: '2020-11-02',fechado: 'S', tipo_nota: 2}).table('nota').transacting(trx);
                for(let i = 0; i < materiais.length; i++){
                    materiais[i].cod_nota = id;
                }
                await knex.insert(materiais).table('venda_material').transacting(trx);
            }); 
            return result;
        }catch(err){
            console.log(err);
        }
    }

    async update(venda_material, id_venda){
        console.table(venda_material);
        console.log(id_venda)
        try{
            const {tipo_material, preco, medida_referencia, peso, total, cod_nota} = venda_material;
            await knex.transaction(async trx => {
                await knex.update({
                    tipo_material,
                    preco,
                    medida_referencia,
                    peso,
                    total
                }).table('venda_material').where({'id_venda': id_venda}).transacting(trx);
                await knex.update({
                    total
                }).table('nota').where({'cod_nota': cod_nota}).transacting(trx);
            }); 
        }catch(err){
            console.log(err);
            return {msg: 'Erro ao atualizar', err};
        }
    }

    async findById(id){
        try{
            const venda = knex.select('*').from('venda_material').where({cod_nota : id});
            return venda;
        }catch(err){
            return {msg: 'Erro ao buscar vendas', err};
        }
    }

    async deleteNota(id){
        try{
            await knex.transaction(async trx => {
                await knex.delete().table('venda_material').where({'cod_nota': id}).transacting(trx);
                await knex.delete().table('nota').where({'cod_nota': id}).transacting(trx);
            }); 
           
        }catch(err){
            return {msg: 'Erro ao atualizar', err};
        }
    }
}

module.exports = new Venda();