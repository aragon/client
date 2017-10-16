import Promise from 'bluebird'
import { keystore } from 'eth-lightwallet'
import CryptoJS from 'crypto-js'

function generateRandomSeed () {
  return keystore.generateRandomSeed()
}

function isSeedValid (seed) {
  return keystore.isSeedValid(seed)
}

function encrypt (text, password, cb) {
  if (!text || text === '') {
    cb('Provide valid input for encryption')
    return
  }

  if (password.length < 8) {
    cb('Provide strong password for encryption (minimum length 8)')
    return
  }

  const ciphertext = CryptoJS.AES.encrypt(text, password).toString()

  if (!ciphertext || ciphertext === '') {
    cb('Something went wrong while encrypting input')
    return
  }

  cb(null, ciphertext)
}

function decrypt (ciphertext, password) {
  if (!ciphertext || ciphertext === '') {
    return Promise.reject(new Error('Provide valid input for decryption'))
  }

  let text

  try {
    text = CryptoJS.AES.decrypt(ciphertext, password).toString(CryptoJS.enc.Utf8)
  } catch (e) {
    return Promise.reject(e)
  }

  if (!text || text === '') {
    return Promise.reject(new Error('Incorrect password'))
  }

  return Promise.resolve(text)
}

export {
  generateRandomSeed,
  isSeedValid,
  encrypt,
  decrypt
}
