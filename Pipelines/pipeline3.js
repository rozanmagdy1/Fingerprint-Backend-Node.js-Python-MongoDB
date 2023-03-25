class Pipeline3 {

    pipeLineThree(path,spawn){
        return new Promise(function(resolve) {
            const childPython = spawn('python',
                ["./python/pipline3.py", `./DataBasesImages/TransactionType4/${path}.jpg`]);

            childPython.stdout.on('data',(data)=>{
                let result = data.toString()
                result = JSON.parse(result)
                resolve(result)
            });
        })
    }

}
module.exports = {
    Pipeline3
}