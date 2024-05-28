import { readdir, readFile, writeFile } from 'fs/promises'

readdir('.')
    .then(files => {
        const jsFiles = files.filter(file => file.endsWith('.js'))

        jsFiles.forEach(jsFile =>
            readFile(jsFile, 'utf-8')
                .then(content => {
                    const regex = /^import.*\.\//

                    let newContent = ''

                    let changed = false

                    content.split('\n').forEach(line => {
                        if (regex.test(line)) {
                            newContent += line.replace('\';', '.js\';')

                            changed = true
                        } else newContent += line

                        newContent += '\n'
                    })

                    if (changed)
                        writeFile(jsFile, newContent)
                            .then(() => console.log(`${jsFile} updated`))
                            .catch(console.error)
                })
                .catch(console.error)
        )
    })
    .catch(console.error)