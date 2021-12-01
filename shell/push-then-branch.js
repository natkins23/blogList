const { exec } = require('child_process')

const args = process.argv
let msg = args.slice(3).join(' ')
const exercise = args.slice(2, 3).join(' ')

// pushing changes
console.log(`Nice job completing exercise ${exercise} saving your changes... (${msg})`)

console.log(`Adding, committing, and pushing changes to main...`)

if (msg === exercise) {
    msg = `Exercise ${exercise} completed `
} else {
    msg = `Exercise ${exercise} completed: ${msg}`
}

exec('git add .', addcb)

function addcb(err) {
    if (err) {
        console.log(err)
        return
    }
    console.log(`Changes added`)
    exec(`git commit -m "${msg}"`, commitcb)
}

function commitcb(err) {
    if (err) {
        console.log(err)
        return
    }
    console.log(`Changes committed: ${msg}`)
    exec(`git push`, pushcb)
}
function pushcb(err) {
    if (err) {
        console.log(err)
        return
    }
    console.log(`Changes pushed`)
}

// createing new branch
const newBranch = exercise

setTimeout(() => exec(`git branch "${newBranch}"`, makeBranch), 3000)

function makeBranch(err) {
    if (err) {
        console.log(err)
        return
    }
    console.log(`Creating new branch... (${newBranch})`)
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
