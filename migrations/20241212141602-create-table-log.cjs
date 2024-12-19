const { DataTypes } = require('sequelize')

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable(
        'logs',
        {
          id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
          },
          action: {
            type: DataTypes.STRING,
            allowNull: false
          },
          userId: {
            type: DataTypes.UUID,
            references: {
              model: 'users',
              key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
          },
          entity: {
            type: DataTypes.STRING,
            allowNull: false
          },
          entityId: {
            type: DataTypes.STRING,
            allowNull: true
          },
          query: {
            type: DataTypes.TEXT,
            allowNull: true
          },
          status: {
            type: DataTypes.STRING,
            allowNull: false
          },
          createdAt: {
            type: DataTypes.DATE,
            allowNull: false
          },
          updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
          }
        },
        { transaction }
      )
    })
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.dropTable('logs', { transaction })
    })
  }
}
