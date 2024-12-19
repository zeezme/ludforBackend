import BaseRepository from '../../_Core/Repository/BaseRepository.js'
import Employee from '../Models/EmployeeModel.js'

class EmployeeRepository extends BaseRepository<Employee> {
  constructor() {
    super(Employee)
  }
}

export default EmployeeRepository
