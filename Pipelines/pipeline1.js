class Pipeline1 {
    pipeLineOne(path, folderName, spawn, transaction_no) {
        return new Promise(function (resolve) {
            const childPython = spawn('python',
                ["./python/pipline1.py",
                    [`./DataBasesImages/TransactionType${transaction_no}/${path}.jpg`],
                    [`./DataBasesImages/${folderName}`],
                    [`./DataBasesImages/${folderName}/`]
                ]);
            childPython.stdout.on('data', (data) => {
                let result = data.toString();
                result = JSON.parse(result);
                resolve(result);
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
    Pipeline1
}