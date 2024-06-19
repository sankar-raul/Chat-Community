const fs = require('fs')
const path = require('path')
let notes = () => {
  return new Promise((resolve, reject) => {
  fs.readFile(path.join(__dirname, '..', 'chatFiles', 'notes.txt'), 'utf-8', (err, data) => {
    err && reject(err)
    resolve(data)
  })
})
}
async function createFileIfNotExist(path) {
    fs.access(path, fs.constants.F_OK, (err) => {
        if (err) {
        notes().then((items) => {
          fs.writeFile(path, items, (err) => {
            err && console.error(`Error creating file: ${err}`)
          })
        }).catch(err => {
          console.error(err)
        })
        }
      })
}
module.exports = createFileIfNotExist