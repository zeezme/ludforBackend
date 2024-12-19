const { DataTypes } = require('sequelize')

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable(
        'persons',
        {
          id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
          },
          name: {
            type: DataTypes.STRING(80),
            allowNull: false
          },
          email: {
            type: DataTypes.STRING(60),
            allowNull: false
          },
          phone: {
            type: DataTypes.STRING(11),
            allowNull: true
          },
          active: {
            type: DataTypes.BOOLEAN,
            allowNull: true
          },
          extension: {
            type: DataTypes.STRING(10),
            allowNull: true
          },
          neighborhood: {
            type: DataTypes.STRING(120),
            allowNull: true
          },
          complement: {
            type: DataTypes.STRING(120),
            allowNull: true
          },
          address: {
            type: DataTypes.STRING(80),
            allowNull: true
          },
          number: {
            type: DataTypes.STRING(15),
            allowNull: true
          },
          city: {
            type: DataTypes.STRING(80),
            allowNull: true
          },
          state: {
            type: DataTypes.STRING(40),
            allowNull: true
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

      await queryInterface.sequelize.query(
        "CREATE TYPE \"personTypeEnum\" AS ENUM ('user', 'admin')",
        { transaction }
      )

      await queryInterface.sequelize.query(
        'ALTER TABLE "persons" ADD COLUMN "type" "personTypeEnum" NOT NULL',
        { transaction }
      )

      const tableExists = await queryInterface.sequelize.query(
        "SELECT to_regclass('public.users')",
        { transaction }
      )

      if (!tableExists[0][0].to_regclass) {
        await queryInterface.createTable(
          'users',
          {
            id: {
              type: DataTypes.UUID,
              allowNull: false,
              defaultValue: DataTypes.UUIDV4,
              primaryKey: true
            },
            username: {
              type: DataTypes.STRING(20),
              allowNull: false
            },
            password: {
              type: DataTypes.STRING(80),
              allowNull: false
            },
            email: {
              type: DataTypes.STRING(60),
              allowNull: false
            },
            phone: {
              type: DataTypes.STRING(11),
              allowNull: true
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
      }

      await queryInterface.addColumn(
        'users',
        'personId',
        {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'persons',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        { transaction }
      )

      await queryInterface.addColumn(
        'persons',
        'userId',
        {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        { transaction }
      )
    })
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.removeColumn('persons', 'userId', { transaction })

      await queryInterface.removeColumn('users', 'personId', { transaction })

      await queryInterface.dropTable('users', { transaction })

      await queryInterface.sequelize.query(
        'ALTER TABLE "persons" DROP COLUMN IF EXISTS "type"',
        { transaction }
      )

      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "personTypeEnum"',
        { transaction }
      )

      await queryInterface.dropTable('persons', { transaction })
    })
  }
}
