const fs = require('fs')

class Config {
    configFilePath = 'user.config.json'
    userConfig = {}

    constructor() {
        if (fs.existsSync(this.configFilePath)) {
            console.log('FOUND USER CONFIG FILE')
            this.userConfig = JSON.parse(fs.readFileSync(this.configFilePath, 'utf8'))
            console.log('USER CONFIG', this.userConfig)
        } else {
            console.log('USER CONFIG FILE NOT FOUND')
        }
    }

    get(key) {
        if (this.exists(key)) {
            return this.userConfig[key]
        } else {
            return null
        }
    }

    set(key, value) {
        this.userConfig[key] = value
        this.save()
    }

    save() {
        fs.writeFileSync(this.configFilePath, JSON.stringify(this.userConfig), 'utf8')
    }

    exists(key) {
        return this.userConfig.hasOwnProperty(key)
    }
}

module.exports = {
    Config
}