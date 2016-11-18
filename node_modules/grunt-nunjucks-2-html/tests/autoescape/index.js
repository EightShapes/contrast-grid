'use strict'

const expect = require('expect.js')
const fs = require('fs')
const util = require('util')
const path = require('path')

let expected = fs.readFileSync(path.join(__dirname, 'output.html')).toString()
let generated = fs.readFileSync(path.join(__dirname, '_output.html')).toString()

module.exports = function () {
  try {
    expect(expected).to.eql(generated)
  } catch (e) {
    console.log(util.inspect(e, {colors: true}))
  }
}
