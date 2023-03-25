class Pipeline1 {

    pipeLineOne(path,folderName,spawn,transaction_no){
        return new Promise(function(resolve) {
            const childPython = spawn('python',
                ["./python/pipline1.py",
                    [`./DataBasesImages/TransactionType${transaction_no}/${path}.jpg`],
                    [`./DataBasesImages/${folderName}`],
                    [`./DataBasesImages/${folderName}/`]
                ]);

            childPython.stdout.on('data',(data)=>{
                let result = data.toString()
                result = JSON.parse(result)
                resolve(result)
            });
        })
    }
}

module.exports = {
    Pipeline1
}