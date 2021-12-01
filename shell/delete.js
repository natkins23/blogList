const { exec } = require('child_process')

const args = process.argv

const deleteBranch = args.slice(2).join(' ')
console.log(`Deleting branch... (${deleteBranch})`)

exec(`git branch -d "${deleteBranch}"`, deleteLocal)

function deleteLocal(err) {
    if (err) {
        console.log(err)
        return
    }
    exec(`git push origin --delete "${deleteBranch}"`, deleteRemote)
    console.log(`Branch was deleted locally`)
}

function deleteRemote(err) {
    if (err) {
        console.log(err)
        return
    }
    console.log(`Branch was deleted remotely`)
}
