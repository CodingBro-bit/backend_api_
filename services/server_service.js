import express from 'express'
import dotenv from 'dotenv'
dotenv.config();


export class Server {

    constructor(port , middlewares = [] , routes = {} , connection){
        
        this.app = express();
        this.port = port;
        this.middlewares = middlewares;
        this.routes = routes;
        this.connection = connection;
    }

    addMiddlwares(midd){
        this.middlewares.push(midd);
    }

    configureMiddlwares(){
        this.middlewares.forEach( middlware => {
            this.app.use(middlware)
        })
    }

    getMiddlwares(){
        return this.middlewares;
    }

    configureRoutes(){

        const router = express.Router();

        for(let route in this.routes){
            console.log(route)
            console.log(this.routes[route])
            this.routes[route].forEach(
                r => {
                    
                    for(let url in r){
                        
                        if(Array.isArray(r[url]))
                        {
                            // console.log(url , r[url])
                            const array_of_urls = r[url]
                            console.log(array_of_urls)
                            router[route](url , ...array_of_urls)                         

                        }
                        else{
                            // console.log(url)
                            router[route](url , r[url])  
                        }
                           
                    }
                    
                }
            )
        }
        this.app.use(router);
    }
    
    async start(){

        try {
            await this.connection.seedDatabase();
       
            console.log(this.port)
            this.app.listen( this.port , 
                () => {
                    console.log(`this app is running at ${this.port}`)
                }
            )
        } catch (error) {
            console.log(`something went wrong starting the server ${error}`)   
        }
    }
}



// addRoutes(route){
//     this.routes.push(route);
// }

// getRoutes(){
//     return this.routes;
// }
