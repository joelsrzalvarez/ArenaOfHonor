class Logger {
    static DEBUG = 0
    static INFO = 1
    static WARN = 2
    static ERROR = 3
    static FATAL = 4

    level = Logger.DEBUG

    #buildMessage(messages) {
        return `${new Date().toISOString()} - ${messages.join(' ')}`
    }

    debug(...messages) {
        this.level < Logger.INFO && console.debug(`%c${this.#buildMessage(messages)}`, 'color: greenyellow')
    }

    info(...messages) {
        this.level < Logger.WARN && console.info(`%c${this.#buildMessage(messages)}`, 'color: dodgerblue')
    }

    warn(...messages) {
        this.level < Logger.ERROR && console.warn(`%c${this.#buildMessage(messages)}`, 'color: orange')
    }

    error(...messages) {
        this.level < Logger.FATAL && console.error(`%c${this.#buildMessage(messages)}`, 'color: tomato')
    }

    fatal(...messages) {
        console.error(`%c${this.#buildMessage(messages)}`, 'background-color: red; color: white; padding: 0 .5rem')
    }
}

export default Logger