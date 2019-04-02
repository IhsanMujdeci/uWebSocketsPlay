const uwu = require('uWebSockets.js');


const app = uwu.App();

app.get('/', function(res, req){
    res.end('hey')
})

async function postHandler(res, req){
    const body = await bodyJson(res)

    if (body.marco){
        res.writeStatus("200")
        res.write("polo")
    } else{
        res.writeStatus("400")
    }

    return res.end()

}

function applyMiddlewares(handler, ...middlewares){
    return function(res, req){
        for(let m of middlewares){
            m(res, req)
        }
        return handler(res, req)
    }
}

app.post('/', applyMiddlewares(postHandler, abortHandler));

app.listen(3000, (token) => {
    console.log(token)
})

function bodyJson(res){
    return new Promise((resolve, reject)=>{
        res.onData(function(data){
            try{
                resolve(JSON.parse(new TextDecoder('utf-8').decode(data)))
            } catch(err) {
                reject(err)
            }
        })
    })
}

function Logger(res, req, nextHandler){
    console.log(res.body);
    nextHandler(res, req)
}

function abortHandler(res){
    res.onAborted(function(err){
        console.log(err)
    });
    return res
}

/* Helper function for reading a posted JSON body */
function readJson(req, res, nextHandler) {

    return new Promise((resolve, reject) => {
        let buffer;
        /* Register data cb */
        res.onData((ab, isLast) => {
            let chunk = Buffer.from(ab);
            if (isLast) {
                let json;
                if (buffer) {
                    try {
                        json = JSON.parse(Buffer.concat([buffer, chunk]));
                    } catch (e) {
                        /* res.close calls onAborted */
                        res.close();
                        return reject(e);
                    }
                    res.body = json;
                    nextHandler(req, res)
                } else {
                    try {
                        json = JSON.parse(chunk);
                    } catch (e) {
                        /* res.close calls onAborted */
                        res.close();
                        return reject(e);
                    }
                    return resolve(json);
                }
            } else {
                if (buffer) {
                    buffer = Buffer.concat([buffer, chunk]);
                } else {
                    buffer = Buffer.concat([chunk]);
                }
            }
        });

        /* Register error cb */
        res.onAborted(err);
    });

}


/* Helper function for reading a posted JSON body */
function readJsonCb(res, cb, err) {
    let buffer;
    /* Register data cb */
    res.onData((ab, isLast) => {
        let chunk = Buffer.from(ab);
        if (isLast) {
            let json;
            if (buffer) {
                try {
                    json = JSON.parse(Buffer.concat([buffer, chunk]));
                } catch (e) {
                    /* res.close calls onAborted */
                    res.close();
                    return;
                }
                cb(json);
            } else {
                try {
                    json = JSON.parse(chunk);
                } catch (e) {
                    /* res.close calls onAborted */
                    res.close();
                    return;
                }
                cb(json);
            }
        } else {
            if (buffer) {
                buffer = Buffer.concat([buffer, chunk]);
            } else {
                buffer = Buffer.concat([chunk]);
            }
        }
    });

    res.onAborted(err);
}

