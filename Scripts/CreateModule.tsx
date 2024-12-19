/* eslint-disable no-console */
import Chalk from 'chalk'
import chalk from 'chalk'
import ora from 'ora'
import { execSync } from 'child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import figlet from 'figlet'
import { exit } from 'process'

const __dirname = dirname(fileURLToPath(import.meta.url))

const isRemove = process.env.REMOVE_MODULE === 'true'
const moduleName = process.argv[2]

if (!moduleName) {
  console.error(
    'Por favor, forneça um nome para o módulo: npm run create:module <moduleName>'
  )
  process.exit(1)
}

const moduleNameUpperCase =
  moduleName.charAt(0).toUpperCase() + moduleName.slice(1).toLowerCase()

const moduleNamePluralLowerCase = moduleName
  .toLowerCase()
  .replace(/s$/, '')
  .concat('s')

const baseDir = join(__dirname, '..', 'src', 'Modules', moduleNameUpperCase)

const defaultRoutesPath = join(
  __dirname,
  '..',
  'src',
  'Modules',
  '_Core',
  'Routes',
  'DefaultRoutes.ts'
)

const configModelsPath = join(__dirname, '..', 'config', 'models.ts')

const structure = {
  Controller: ['Controller.txt'],
  Services: ['Service.txt'],
  Repository: ['Repository.txt'],
  Routes: ['Routes.txt'],
  Models: ['Model.txt']
}

const updateDefaultRoutes = () => {
  const spinner = ora('Atualizando rotas em defaultRoutes.ts...').start()
  try {
    const importStatement = `import ${moduleNameUpperCase}Router from '../../${moduleNameUpperCase}/Routes/${moduleNameUpperCase}Routes.js'\n`
    const useStatement = `defaultRoutes.use('/${moduleName.toLowerCase()}', ${moduleNameUpperCase}Router)\n`

    if (!existsSync(defaultRoutesPath)) {
      spinner.fail(
        `O arquivo defaultRoutes.ts não foi encontrado em ${defaultRoutesPath}`
      )
      return
    }

    const content = readFileSync(defaultRoutesPath, 'utf-8')
    const updatedContent = `${importStatement}\n${content}\n${useStatement}`
    writeFileSync(defaultRoutesPath, updatedContent, 'utf-8')
    spinner.succeed(
      `Rota adicionada ao defaultRoutes.ts: ${useStatement.trim()}`
    )
  } catch (error) {
    spinner.fail('Erro ao atualizar defaultRoutes.ts')
    console.error(error)
  }
}

const updateConfigModels = () => {
  const spinner = ora('Atualizando models.ts...').start()
  try {
    const modelImport = `import ${moduleNameUpperCase} from '../src/Modules/${moduleNameUpperCase}/Models/${moduleNameUpperCase}Model.js'\n`

    if (!existsSync(configModelsPath)) {
      const initialContent = `${modelImport}\nexport const models = [ ${moduleNameUpperCase} ]`
      writeFileSync(configModelsPath, initialContent, 'utf-8')
      spinner.succeed(
        `Arquivo models.ts criado e ${moduleNameUpperCase} adicionado.`
      )
    } else {
      const content = readFileSync(configModelsPath, 'utf-8')
      const updatedContent = `${modelImport}\n${content.replace(
        /export\s+const\s+models\s+=\s+\[(.*?)\]/s,
        (match, p1) =>
          `export const models = [${p1 ? `${p1}, ` : ''}${moduleNameUpperCase}]`
      )}`
      writeFileSync(configModelsPath, updatedContent, 'utf-8')
      spinner.succeed('Model adicionado ao models.ts.')
    }
  } catch (error) {
    spinner.fail('Erro ao atualizar models.ts')
    console.error(error)
  }
}

const createStructure = () => {
  const spinner = ora(
    Chalk.green.bold(
      `Iniciando a criação do módulo "${moduleNameUpperCase}"...`
    )
  ).start()
  try {
    if (existsSync(baseDir)) {
      spinner.warn(`O módulo "${moduleNameUpperCase}" já existe.`)
      return exit(1)
    }

    spinner.succeed(
      `Diretório base para o módulo "${moduleNameUpperCase}" criado.`
    )

    Object.entries(structure).forEach(([folder, files]) => {
      const folderPath = join(baseDir, folder)
      const folderSpinner = ora(`Criando pasta: ${folderPath}`).start()

      if (!existsSync(folderPath)) {
        mkdirSync(folderPath, { recursive: true })
        folderSpinner.succeed(
          `${Chalk.green.bold('Pasta criada:')} ${folderPath}`
        )
      } else {
        folderSpinner.warn(`${folderPath} já existe.`)
      }

      files.forEach(file => {
        const templatePath = join(__dirname, 'Templates', file)

        const fileName =
          file
            .replace('.txt', '')
            .replace(
              /(Controller|Service|Repository|Routes|Model|Types)/,
              `${moduleNameUpperCase}$&`
            ) + '.ts'
        const filePath = join(folderPath, fileName)
        const fileSpinner = ora(`Criando arquivo: ${filePath}`).start()

        if (existsSync(templatePath)) {
          let content = readFileSync(templatePath, 'utf-8')
          content = content.replace(/{{ModuleName}}/g, moduleNameUpperCase)
          content = content.replace(
            /{{ModuleNamePluralLowerCase}}/g,
            moduleNamePluralLowerCase
          )

          writeFileSync(filePath, content)
          fileSpinner.succeed(
            `${Chalk.magenta.bold('Arquivo criado:')} ${filePath}`
          )
        } else {
          fileSpinner.fail(`Template não encontrado: ${templatePath}`)
          console.error(`Template não encontrado: ${templatePath}`)
        }
      })
    })

    updateDefaultRoutes()
    updateConfigModels()
    spinner.succeed(`Estrutura criada para o módulo "${moduleNameUpperCase}".`)
  } catch (error) {
    spinner.fail(
      `Erro ao criar estrutura para o módulo "${moduleNameUpperCase}".`
    )
    console.error(error)
  }
}

const undoCreateModule = () => {
  const spinner = ora(`Removendo o módulo "${moduleNameUpperCase}"...`).start()
  try {
    if (!existsSync(baseDir)) {
      spinner.fail(`O módulo "${moduleNameUpperCase}" não existe.`)

      return exit(1)
    }

    rmSync(baseDir, { recursive: true, force: true })
    spinner.succeed(`Módulo "${moduleNameUpperCase}" removido.`)

    if (existsSync(defaultRoutesPath)) {
      let content = readFileSync(defaultRoutesPath, 'utf-8')
      const importStatement = new RegExp(
        `import\\s+${moduleNameUpperCase}Router\\s+from\\s+'\\.\\.\\/\\.\\.\\/${moduleNameUpperCase}\\/Routes\\/${moduleNameUpperCase}Routes\\.js'\\n`,
        'g'
      )
      const useStatement = new RegExp(
        `defaultRoutes\\.use\\('/${moduleName.toLowerCase()}',\\s+${moduleNameUpperCase}Router\\)\\n`,
        'g'
      )
      content = content.replace(importStatement, '').replace(useStatement, '')
      writeFileSync(defaultRoutesPath, content, 'utf-8')
      console.log(`Rota removida do defaultRoutes.ts.`)
    }

    if (existsSync(configModelsPath)) {
      let content = readFileSync(configModelsPath, 'utf-8')
      const modelImport = new RegExp(
        `import\\s+${moduleNameUpperCase}\\s+from\\s+'\\.\\.\\/src\\/Modules\\/${moduleNameUpperCase}\\/Models\\/${moduleNameUpperCase}Model\\.js'\\n`,
        'g'
      )
      const modelArrayEntry = new RegExp(
        `\\b${moduleNameUpperCase}\\b\\s*,?|,?\\s*\\b${moduleNameUpperCase}\\b`,
        'g'
      )
      content = content.replace(modelImport, '').replace(modelArrayEntry, '')
      writeFileSync(configModelsPath, content.trim(), 'utf-8')
      console.log(
        Chalk.cyan.bold(`Model ${moduleNameUpperCase} removido do models.ts.`)
      )
    }
  } catch (error) {
    spinner.fail(`Erro ao remover o módulo "${moduleNameUpperCase}".`)
    console.error(error)
  }
}

if (isRemove) {
  undoCreateModule()
} else {
  createStructure()
}

const lintSpinner = ora(
  Chalk.hex('#ff6700').bold('Aplicando lint, por favor aguarde!')
).start()

try {
  execSync(
    'eslint config/models.ts src/Modules/_Core/Routes/DefaultRoutes.ts --fix',
    { stdio: 'inherit' }
  )
  lintSpinner.succeed(Chalk.green.bold('Lint aplicado com sucesso!'))
} catch (error) {
  lintSpinner.fail('Erro ao aplicar o lint.')
  console.error(error)
}

console.log(
  Chalk.cyan.bold(
    `O Módulo ${moduleNameUpperCase} Foi ${isRemove === true ? 'Removido' : 'Criado'} com Sucesso!`
  )
)

if (isRemove === false) {
  console.log(
    Chalk.green.bold(
      figlet.textSync('Happy Coding', {
        font: 'ANSI Shadow'
      })
    ),
    chalk.yellow.bold('by Lucão do Código'),
    '\n\n'
  )
}
