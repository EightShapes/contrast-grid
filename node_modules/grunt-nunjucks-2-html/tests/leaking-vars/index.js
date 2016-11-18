'use strict'

const expect = require('expect.js')
const fs = require('fs')
const util = require('util')
const path = require('path')

let expected = [
  fs.readFileSync(path.join(__dirname, 'output1.html')).toString(),
  fs.readFileSync(path.join(__dirname, 'output2.html')).toString()
]
let generated = [
  fs.readFileSync(path.join(__dirname, '_output1.html')).toString(),
  fs.readFileSync(path.join(__dirname, '_output2.html')).toString()
]

module.exports = function () {
  expected.forEach((input, i) => {
    try {
      expect(input).to.eql(generated[i])
    } catch (e) {
      console.log(util.inspect(e, {colors: true}))
    }
  })
}
