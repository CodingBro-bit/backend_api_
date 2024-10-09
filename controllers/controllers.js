import { User } from "../services/user_service.js"
import jwt from 'jsonwebtoken'
import { insert_to_database_posts, search_by_id } from "../database/queries.js";
import { pool } from "../database/database.js";

export class Controller{
    constructor(){

    }
    
    static async signController(req , res){

        const {username , password} = req.body
        
        try {

            const user = new User(username);
            user.setPassword(password)
            const result = await user.signUser();
            if(result)

                console.log(result.rows)
                return res.status(200).json({
                
                    message : 'completed' ,
                    user : result.rows[0].username
                })
        } catch (error) {

            console.log(`error on sign the user ${error}`)
        
        }
    }

    static async logController(req , res){

        const {username , password} = req.body;

        try {
            
            const user = new User(username );
            user.setPassword(password);
            const result = await user.logUser();
            console.log(result)
            if(result)
            {
                const token = jwt.sign({user:result.rows[0].username} , process.env.SECRET , {expiresIn:'40s'});
                
                let options = {

                    maxAge : 20 * 60 * 1000,  //would expire in 20minutes
                    httpOnly: true,  //The cookie is only accessible by the web server
                    secure: false,
                    sameSite: "None",  
                }

                res.cookie('token' , token , options)
                
                return res.status(200).json({
                
                    message : 'completed' ,
                    user : result.rows[0].username ,
                    token
                })
            }

        } catch (error) {
            
            console.log(error)
        }

    }
    static async createPosts(req , res){            

            const {content} = req.body;
            const user = req.user;
            console.log(`my user logged ${user}`)

            try {

                const user_obj = await User.searchByname(user);

                if(!user_obj){
                    return res.status(404).json({
                        message : 'not found'
                    });
                }

                console.log(`retrieved ${user_obj}`)

                const retrieve = await pool.query(search_by_id , [user_obj.id]);

                if(!retrieve)
                    return res.status(404).json({
                    
                        message : 'not such user'
                })

                const existing = new User(user_obj.username);
                existing.setPassword(user_obj.password);
                const {post , user_posts} = existing.addPosts(content);

                const postQuery = await pool.query(insert_to_database_posts , [user_obj.id , post.content , post.createdAt ])
                

                return res.status(200).json({

                    message : 'post created' , 
                    myposts : postQuery.rows[0] , 
                    user_posts

                });

            } catch (error) {
                    
                console.log(`something occured on creating posts`)
            }

    }
}