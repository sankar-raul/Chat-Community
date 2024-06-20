const { throws } = require('assert')
const fs = require('fs')
const path = require('path')
const handleChatCommand = (command) => {
    switch (command) {
        case 'delete_all_chat':
            fs.readFile(path.join(__dirname, '..', 'chatFiles', 'notes.txt'), 'utf-8', (err, data) => {
                err && console.error(err)
                fs.writeFile(path.join(__dirname, '..', 'chatFiles', 'chat.txt'), data, (err) => {
                  if (err) throw new Error(err)
                })
            })
            break
        case 'delete_previous_msg':
            fs.readFile(path.join(__dirname, '..', 'chatFiles', 'chat.txt'), 'utf-8', (err, data) => {
                err && console.error(err)
                const msgsList = data.split('%$ank@r%')
                if (msgsList.length > 7) {
                    msgsList.pop()
                    msgsList.pop()
                    msgsList.push('')
                }
                const msgs = msgsList.join('%$ank@r%')
                fs.writeFile(path.join(__dirname, '..', 'chatFiles', 'chat.txt'), msgs, (err) => {
                  if (err) throw new Error(err)
                })
            })
            break
        default:
            console.log("default")
            return false
    }
    return command
}
module.exports = handleChatCommand
