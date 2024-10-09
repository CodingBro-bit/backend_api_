import { Controller } from "../controllers/controllers.js";
import {  post_table, search_by_id_post } from "../database/queries.js";
import Verify from "../middleware/auth.js";
import { User } from "../services/user_service.js";
import { pool } from "../database/database.js";


export const routes = 
{
    'get' : [
        
        {
            '/signup' : (req , res) => {
                res.json({
                    message : 'welcome to signup'
                });
            }
        },
        {
            '/login' : (req , res) => {
                res.json({
                    message : 'welcome to login'
                });
            }
        },
        {
            '/user' : [
                Verify , async(req , res) => {

                            const retrieve = await User.searchByname(req.user);
                            
                            await pool.query(post_table);

                            res.json({
                                message : `welcome ${req.user}`,
                                retrieve
                            });
                }
            ]
        },
        {
            '/post/:id' : [Verify , async(req , res) => {

                const id = parseInt(req.params.id);

                if(isNaN(id)){
                    return res.status(401).json({
                        message : 'invalid id'
                    })
                }

                const retrieve = await pool.query(search_by_id_post , [id]);

                if(!retrieve){
                    return res.status(404).json({
                        message : 'not found'
                    })
                }

                return res.status(200).json({
                    post : retrieve.rows[0].content
                })
            }]
        }
        

    ] , 
    'post' : [
                    {
                        '/signup' : Controller.signController
                    },
                    {
                        '/login' : Controller.logController
                    },
                    {
                        '/user' : [ Verify , Controller.createPosts]
                    },
                    

    ]
}