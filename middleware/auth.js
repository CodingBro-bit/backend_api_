import jwt from 'jsonwebtoken'


export default function Verify(req , res , next){

    try {
        
        console.log('my cookie '+req.headers.cookie)
        

        const cookie = req.headers.cookie;

        if(!cookie){
            return res.status(403).json({
                message : 'unauthorized'
            })
        }

        const token = cookie.split('=')[1];

        if(!token){
            return res.status(404).json({
                message : "token not found"
            })
        }

        jwt.verify(token , process.env.SECRET , (err , decoded) => {

            if(err){

                return res.status(403).json({
                    message : 'something went wrong with verification'
                });

            }else{

                console.log('after decoding '+JSON.stringify(decoded));
                
                req.user = decoded.user;
                next();
            }
        });
    } catch (error) {
        console.log(error)
    }



}