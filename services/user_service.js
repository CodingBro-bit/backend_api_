
import { searchbyusername , insert_to_database} from '../database/queries.js';
import { pool } from '../database/database.js';
import bcrypt from 'bcryptjs'
import { Post } from './post_service.js';


export class User{

    constructor(username){
        
            this.username = username;
            this.password = '';
            this.posts = []; 
    }

    setPassword(pass){
        this.password = pass;
    }

    getPassword(){
        return this.password;
    }

    async signUser(){

        try {

            const retrieve = await pool.query(searchbyusername , [this.username]);

            if(retrieve.rows.length > 0) 
                return res.status(401).json({
                    message : 'already exists'
                });
            
            const hpassword = await bcrypt.hash(this.password , 10) ;

            const result = await pool.query(insert_to_database , [this.username , hpassword])

            return result;
        } catch (error) {
            
            console.log(`error on sign the user ${error}`)
        }        
    }

    async logUser(){
        try {
            
            const retrieve = await pool.query(searchbyusername , [this.username]);

            if(retrieve.rows.length === 0)
                return res.status(404).json({
                    message : 'user not found'
            })
            console.log(retrieve.rows)
            const match = await bcrypt.compare(this.password , retrieve.rows[0].password);

            if(!match)
                return res.status(401).json({
                    message : 'incorrect code'
                })
            
            return retrieve;
        } catch (error) {
            console.log(`an error occured in login ${error}`)
        }
    }
    addPosts(p){
        const post = new Post(p);
        this.posts.push(post);
        const user_posts = [...this.posts]
        return {
            post , user_posts
        };
    }

    static async searchByname(name){

        try {
        
            const retrieve = await pool.query(searchbyusername , [name]);
            
            if(retrieve.rows.length === 0){
                return null;
            }

            return retrieve.rows[0];
        
        } catch (error)
        {
            console.log(`something went wrong on quering ${error}`)
        }

    }
    retrievePosts(){}
}