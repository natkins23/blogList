const { exec } = require('child_process')

const args = process.argv

let msg = args.slice(2).join(' ')
if (!msg) {
    msg = `update`
}
console.log(`Adding, committing, and pushing changes... (${msg})`)

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
    console.log(`Changes committed`)
    exec(`git push`, pushcb)
}
function pushcb(err) {
    if (err) {
        console.log(err)
        return
    }
    console.log(`Changes pushed`)
}
