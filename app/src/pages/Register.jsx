import { logger } from '../utils'
import logic from '../logic'
import { useContext } from '../context'

function Register ({onUserRegistered, onLoginClick}) {
    const { showFeedback } = useContext()
    const handleSubmit = event => {
        event.preventDefault()

        const form = event.target

        const name = form.name.value
        const surname = form.surname.value
        const email = form.email.value
        const password = form.password.value
        const honor_points = 0
        const arena_points = 0

        try {
            logic.registerUser(name, surname, email, password, honor_points, arena_points)
            .then(() => {
                    form.reset()

                    onUserRegistered()
                })
                    .catch(error => showFeedback(error, 'error'))
            } catch (error) {
                showFeedback(error)
            }
        }

    const handleLoginClick = event => {
            event.preventDefault()
    
            onLoginClick()
        }

        return (
            <div className="row justify-content-center">
              <div className="col-md-3">
              <form className='form-login' onSubmit={handleSubmit}>
                <h2 className="text-center mb-4" id='text-modal'>Register</h2>
                <hr id='hr-modal'></hr>
                  <div className="mb-3">
                    <input type="text" className="form-control" id="name" placeholder="Your name" />
                  </div>
                  <div className="mb-3">
                    <input type="text" className="form-control" id="surname" placeholder="Your surname" />
                  </div>
                  {/* <div className="mb-3">
                    <input type="date" className="form-control" id="birthdate" placeholder="Birthdate" />
                  </div> */}
                  <div className="mb-3">
                    <input type="email" className="form-control" id="email" placeholder="Email" />
                  </div>
                  {/* <div className="mb-3">
                    <input type="text" className="form-control" id="username" placeholder="Username" />
                  </div> */}
                  <div className="mb-3">
                    <input type="password" className="form-control" id="password" placeholder="Password" />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Register</button>
                  <div className="text-center mt-2">
                    <a style={{ color: '#68daf7' }} onClick={handleLoginClick}>Do you have an account? <strong>Click here</strong> to Log In</a>
                  </div>
                </form>
              </div>
            </div>
          );
        }

export default Register