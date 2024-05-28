import { useParams } from 'react-router-dom'

function Profile() {
    const { name } = useParams()

    return <h1>hello {name}</h1>
}

export default Profile