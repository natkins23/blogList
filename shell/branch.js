const { exec } = require('child_process')

const args = process.argv

const newBranch = args.slice(2).join(' ')

console.log(`Creating new branch... (${newBranch})`)
exec(`git branch "${newBranch}"`, makeBranch)

function makeBranch(err) {
    if (err) {
        console.log(err)
        return
    }
    exec(`git checkout "${newBranch}"`, checkoutNewBranch)
    console.log(`Branch made`)
}

function checkoutNewBranch(err) {
    if (err) {
        console.log(err)
        return
    }
    exec(`git push --set -u origin "${newBranch}"`, pushToRemote)
    console.log(`Remote branch created`)
}

function pushToRemote(err) {
    if (err) {
        console.log(err)
        return
    }
    exec(`git checkout main"`, checkoutMain)
}
function checkoutMain(err) {
    if (err) {
        console.log(err)
        return
    }
    console.log(`Changes pushed to remote branch`)
}
