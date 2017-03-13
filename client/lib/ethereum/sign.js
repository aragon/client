import utils from 'ethereumjs-util'
import sigUtil from 'eth-sig-util'

const personalSign = (from, payload) => {
  const params = [from, payload]
  const method = 'personal_sign'
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
       method,
       params,
       from,
     }, function (err, result) {
       if (err) return reject(err)
       if (result.error) return reject(result.error)
       console.log('result', result)
       resolve(result.result)
    })
  })
}

const personalECRecover = (data, sig) => {
  return sigUtil.recoverPersonalSignature({ sig, data })
}

const toHex = s => utils.bufferToHex(new Buffer(s))

export { personalSign, personalECRecover, toHex }
