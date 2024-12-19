import BaseRepository from '../../_Core/Repository/BaseRepository.js'
import Authentication from '../Models/AuthenticationModel.js'

class AuthenticationRepository extends BaseRepository<Authentication> {
  constructor() {
    super(Authentication)
  }
}

export default AuthenticationRepository
