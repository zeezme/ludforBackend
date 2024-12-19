const { v4: uuidv4 } = require('uuid')

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'permissions',
      [
        {
          id: uuidv4(),
          description: 'person_create',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          description: 'person_read',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          description: 'person_update',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          description: 'person_delete',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          description: 'person_menu',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(
      'permissions',
      {
        description: [
          'person_create',
          'person_read',
          'person_update',
          'person_delete',
          'person_menu'
        ]
      },
      {}
    )
  }
}
