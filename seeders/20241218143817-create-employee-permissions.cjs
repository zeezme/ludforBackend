const { v4: uuidv4 } = require('uuid')

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'permissions',
      [
        {
          id: uuidv4(),
          description: 'employee_create',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          description: 'employee_read',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          description: 'employee_update',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          description: 'employee_delete',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          description: 'employee_menu',
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
          'employee_create',
          'employee_read',
          'employee_update',
          'employee_delete',
          'employee_menu'
        ]
      },
      {}
    )
  }
}
