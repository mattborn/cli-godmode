const { execSync } = require('child_process')
const fse = require('fs-extra')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

const success = (message) => console.log('\x1b[38;5;42m%s\x1b[0m', message)

const updateFiles = () => {
  execSync('rm src/app/fonts/*', { stdio: 'inherit' })

  execSync('npm install @clerk/nextjs', { stdio: 'inherit' })

  try {
    fse.copySync(path.join(__dirname, 'root'), process.cwd(), { overwrite: true })
    success('Files copied successfully.')

    fse.appendFileSync(
      path.join(process.cwd(), '.env.local'),
      `
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
CLERK_SECRET_KEY=${process.env.CLERK_SECRET_KEY}
`,
      'utf8',
    )
    success('Environment variables appended successfully.')
  } catch (error) {
    console.error(error)
  }
  execSync('npx shadcn@latest init -d', { stdio: 'inherit' })
  execSync('npx shadcn@latest add button', { stdio: 'inherit' })

  execSync('git add .', { stdio: 'inherit' })
  execSync('git commit -m "Add Clerk, shadcn, clean up"', { stdio: 'inherit' })
}

module.exports = {
  updateFiles,
}
