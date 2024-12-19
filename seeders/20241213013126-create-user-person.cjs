const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')

module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash('Teste@123', 10)
    const [user] = await queryInterface.bulkInsert(
      'users',
      [
        {
          id: uuidv4(),
          username: 'root',
          password: hashedPassword,
          email: 'admin@admin.com',
          phone: '11987654321',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      { returning: true }
    )

    await queryInterface.bulkInsert(
      'persons',
      [
        {
          id: uuidv4(),
          name: 'João Teste',
          email: 'joao@exemplo.com',
          phone: '11987654321',
          active: true,
          extension: '123',
          neighborhood: 'Centro',
          complement: 'Apto 201',
          address: 'Rua Teste, 123',
          number: '123',
          city: 'São Paulo',
          state: 'SP',
          type: 'user',
          userId: user.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('persons', null, {})
    await queryInterface.bulkDelete('users', null, {})
  }
}
