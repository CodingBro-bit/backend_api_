import pkg from 'pg'
const {Pool} = pkg;
import {tables , url} from '../database/queries.js'



export const pool = new Pool({
    connectionString : url
});

export class Connection{
    
    constructor(){
        
        this.pool = pool;
        this.mytable = tables;
    }


    async seedDatabase(){

        try {
            console.log('seeding...')

            const client = await this.pool.connect();
            await client.query(this.mytable);
            client.release();
            console.log('Table created successfully or already exists.');

        } catch (error) {

            console.error('Error while seeding the database:', error);
        }
    }
}