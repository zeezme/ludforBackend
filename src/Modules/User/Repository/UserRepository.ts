import BaseRepository from '../../_Core/Repository/BaseRepository.js'
import User from '../Models/UserModel.js'

class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User)
  }
}

export default UserRepository
