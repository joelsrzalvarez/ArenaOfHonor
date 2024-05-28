import { logger } from '../utils'

import logic from '../logic'

import { useContext } from '../context'

function Login ({ onUserLoggedIn, onRegisterClick}) {

    const { showFeedback } = useContext()
    const handleSubmit = event => {
        event.preventDefault()

        const form = event.target

        const email = form.email.value
        const password = form.password.value

        try {
            logic.loginUser(email, password)
                .then(() => {
                    form.reset()

                    onUserLoggedIn()
                })
                .catch(error => showFeedback(error, 'error'))
        } catch (error) {
            showFeedback(error)
        }
    }

    const handleRegisterClick  = event => {
        event.preventDefault()

        onRegisterClick()
    }

    return <div className="row justify-content-center">
  <div className="col-md-3">
    <form className='form-login' onSubmit = {handleSubmit}>
      <h2 className="text-center mb-4" id='text-modal'>Login</h2>
      <hr id='hr-modal'></hr>
      <div className="mb-3">
        <input type="email" className="form-control" id="email" placeholder="Email" />
      </div>
      <div className="mb-3">
        <input type="password" className="form-control" id="password" placeholder="Password" />
      </div>
      <button type="submit" className="btn btn-primary w-100 mt-2">Log In</button>
      <div className="text-center mt-2">
      <a style={{ color: '#68daf7' }}  onClick={handleRegisterClick}>You don't have an account? <strong>Click here</strong> to Register</a>
      </div>
    </form>
  </div>
</div>
}

export default Login