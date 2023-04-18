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
            childPython.stderr.on('data', (data) => {
                console.error(`stdout: ${data}`)
            });

            childPython.stderr.on('close', (code) => {
                console.error(`child process exited by code: ${code}`)
            });
        })
    }

}
module.exports = {
    Pipeline3
}