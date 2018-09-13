// Modified version of Vue-cli release
// https://github.com/vuejs/vue-cli/blob/dev/scripts/release.js

const execa = require('execa')
const semver = require('semver')
const inquirer = require('inquirer')
const fs = require('fs')

let package=require('../package.json')

const curVersion = package.version

const release = async () => {
  console.log(`Current version: ${curVersion}`)

  const bumps = ['patch', 'minor', 'major', 'prerelease']
  const versions = {}
  bumps.forEach(b => { versions[b] = semver.inc(curVersion, b) })
  const bumpChoices = bumps.map(b => ({ name: `${b} (${versions[b]})`, value: b }))

  const { bump, customVersion } = await inquirer.prompt([
    {
      name: 'bump',
      message: 'Select release type:',
      type: 'list',
      choices: [
        ...bumpChoices,
        { name: 'custom', value: 'custom' }
      ]
    },
    {
      name: 'customVersion',
      message: 'Input version:',
      type: 'input',
      when: answers => answers.bump === 'custom'
    }
  ])

  const version = customVersion || versions[bump]

  const { yes } = await inquirer.prompt([{
    name: 'yes',
    message: `Confirm releasing ${version}?`,
    type: 'confirm'
  }])

  if (yes) {
    package.version=version
    fs.writeFileSync('package.json',JSON.stringify(package,null,2))
    await execa('git', ['add', '-A'], { stdio: 'inherit' })
    await execa('git', ['add', '--force','*.lock package-lock.json'], { stdio: 'inherit' }).catch(()=>{})
    await execa('git', ['commit', '-m',[version,bump,'release'].join(' ')], { stdio: 'inherit' })
  }
}

release().catch(err => {
  console.error(err)
  process.exit(1)
})
