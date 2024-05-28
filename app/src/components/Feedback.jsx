import { logger } from '../utils'

function Feedback({ message, level, onAcceptClick}) {
    logger[level](message)

    return <div className={`fixed top-0 w-full border-2 border-black ${level === 'error' ? 'bg-red-500' : level === 'warn' ? 'bg-yellow-500' : 'bg-green-500'} flex flex-col items-center`}>
        <h3>{message}</h3>
        <button onClick={onAcceptClick}>Accept</button>
    </div>
}

export default Feedback