import BaseRepository from '../../_Core/Repository/BaseRepository.js'
import Permission from '../Models/PermissionModel.js'

class PermissionRepository extends BaseRepository<Permission> {
  constructor() {
    super(Permission)
  }
}

export default PermissionRepository
