const uwu = require('uWebSockets.js');
const app = uwu.App();

function delay(ms = 0){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve()
        }, ms)
    })
}

async function delayLog(){
    await delay(500);
    console.log("Hey, watch out! Im logging here.")
}

app.get('/', function(res, req){
    applyMiddlewares(req, req, [])
});

app.listen(3000, (token) => {
    console.log(token)
});

async function applyMiddlewares(res, req, middlewares = [], handler){

    for (let m in middlewares){
        try{
            await m(req, res)
        } catch (e) {
            res.onabort(e)
        }
    }

    handler(req, res)
}
