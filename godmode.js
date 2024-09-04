#!/usr/bin/env node

const { Command } = require('commander')
const program = new Command()
const { execSync } = require('child_process')
require('dotenv').config({ path: '.env.local' })

// const fs = require('fs')

program
  .version('0.1.0')
  .description('CLI to automate Next.js project creation and deployment')
  .argument('<projectName>', 'Name of the project to create')
  .option('--destroy', 'Destroy the project on both GitHub and Vercel')
  .option('--skip-next', 'Skip Next.js project creation to retry deployment')
  .option('--skip-github', 'Skip GitHub repo creation to retry Vercel deployment')
  .action((projectName, options) => {
    if (options.destroy) {
      try {
        execSync(`gh repo delete ${process.env.GITHUB_USERNAME}/${projectName} --yes`, { stdio: 'inherit' })
        execSync(`vercel rm ${projectName} --yes`, { stdio: 'inherit' })
        execSync(`rm -rf ${projectName}`, { stdio: 'inherit' })
        console.log(`Destroyed ${projectName} successfully.`)
      } catch (error) {
        console.error(error)
      }
    } else {
      try {
        if (!options.skipNext) {
          execSync(
            `npx create-next-app@latest ${projectName} --no-package-lock --typescript --yes --eslint --tailwind --src-dir --app --import-alias "@/*"`,
            { stdio: 'inherit' },
          )
          process.chdir(projectName)
          execSync('npm install @clerk/nextjs', { stdio: 'inherit' })
          execSync('git add .')
          execSync('git commit -m "Add Clerk"')
        } else {
          process.chdir(projectName)
        }

        if (!options.skipGithub) {
          execSync(`gh repo create ${process.env.GITHUB_USERNAME}/${projectName} --public --push --source=.`, {
            stdio: 'inherit',
          })
        }

        execSync(`vercel link --yes`, { stdio: 'inherit' })
        execSync('vercel deploy')
        execSync('vercel link --repo')

        console.log(`🔥 Project ${projectName} created and deployed successfully`)
      } catch (error) {
        console.error('Error:', error)
      }
    }
  })

program.parse(process.argv)
