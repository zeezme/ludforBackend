import BaseRepository from '../../_Core/Repository/BaseRepository.js'
import Person from '../Models/PersonModel.js'

class PersonRepository extends BaseRepository<Person> {
  constructor() {
    super(Person)
  }
}

export default PersonRepository
