const tape = require('tape')
const jsonist = require('jsonist')
const fs = require('fs')
const path = require('path')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const server = require('./server')

const endpoint = `http://localhost:${port}`
const studentId = 'nav9308'
const studentInfo = {
  courses: {
    english: {
      quizzes: {
        ye0ab62: {
          score: 95
        }
      }
    }
  }
}

tape('PUT /:studentId/properties add property to studend Info', async function (t) {
  const url = `${endpoint}/${studentId}/personalInfo`
  const data = {
    name: 'Navjeet singh',
    register_no: 'uj98kh8_hdhfn89_yuba3d'
  }

  resetTestCaseData()

  jsonist.put(url, data, (err, body, res) => {
    if (err) t.error(err)
    t.equal(res.statusCode, 200, 'http response code should be 200.')
    const updatedStudent = getFileData()
    t.deepEqual(updatedStudent.personalInfo, data, 'Personal info should be equal.')
    t.end()
  })
})

tape('PUT /:studentId/:propertyName/properties checked nested properties', async function (t) {
  const url = `${endpoint}/${studentId}/test1/test2/test3`
  const data = {
    test5: 'test6'
  }

  resetTestCaseData()

  jsonist.put(url, data, (err, body, res) => {
    if (err) t.error(err)
    t.equal(res.statusCode, 200, 'http response code should be 200.')
    const updatedStudent = getFileData()
    t.deepEqual(updatedStudent.test1.test2.test3, data, 'deep object test success.')
    t.end()
  })
})
tape('PUT /:studentId/properties create new file for student if does not exits', async function (t) {
  const url = `${endpoint}/${studentId}/info`
  const data = {
    mars: 'is red'
  }

  removeFile()

  jsonist.put(url, data, (err) => {
    if (err) t.error(err)
    t.ok(checkIfFileExits(), 'File created if not present.')
    t.end()
  })
})

tape('GET /:studentId/properties match student properties', async function (t) {
  const url = `${endpoint}/${studentId}/courses`

  resetTestCaseData()

  jsonist.get(url, (err, body, res) => {
    if (err) t.error(err)
    t.equal(res.statusCode, 200, 'http resonse code should be 200.')
    t.deepEqual(body, studentInfo.courses, 'course info needs to be equal.')
    t.end()
  })
})

tape('GET /:studentId/properties returns Not found if the student file does not exist', async function (t) {
  const url = `${endpoint}/random12903/courses`
  jsonist.get(url, (err, body, res) => {
    if (err) t.error(err)
    t.equal(res.statusCode, 404, 'http resonse status code should be 404')
    t.end()
  })
})
tape('GET /:studentId/properties returns Not found if the property does not exist', async function (t) {
  const url = `${endpoint}/${studentId}/courses/punjabi`
  resetTestCaseData()
  jsonist.get(url, (err, body, res) => {
    if (err) t.error(err)
    t.equal(res.statusCode, 404, 'http resonse status code should be 404')
    t.end()
  })
})
tape('DELETE /:studentId/:propertyName deletes a student property', async function (t) {
  const url = `${endpoint}/${studentId}/courses`
  resetTestCaseData()
  jsonist.delete(url, (err, body, res) => {
    if (err) t.error(err)
    t.equal(res.statusCode, 200, 'http response code should be 200.')
    t.ok(Object.prototype.hasOwnProperty.call(body, 'success'), 'response should have success key.')

    const student = getFileData()
    t.notOk(Object.prototype.hasOwnProperty.call(student, 'address'), 'deleted property should not exits on student file')
    t.end()
  })
})
tape('DELETE /:studentId/:propertyName returns 404 file does not exits', async function (t) {
  const url = `${endpoint}/${studentId}/random`
  jsonist.delete(url, (err, body, res) => {
    if (err) t.error(err)
    t.equal(res.statusCode, 404, 'http resonse status code should be 404')
    t.end()
  })
})

tape('DELETE /:studentId/:propertyName returns 404 if the property does not exist', async function (t) {
  const url = `${endpoint}/${studentId}/invalid_key`
  resetTestCaseData()
  jsonist.delete(url, (err, body, res) => {
    if (err) t.error(err)
    t.equal(res.statusCode, 404, 'http resonse status code should be 404')
    t.end()
  })
})
tape('health', async function (t) {
  const url = `${endpoint}/health`
  jsonist.get(url, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'should have successful healthcheck')
    t.end()
  })
})

function resetFile () {
  if (!fs.existsSync(getDir())) fs.mkdirSync(getDir())
  fs.writeFileSync(filePath(), JSON.stringify(studentInfo))
}
function removeFile () {
  try {
    fs.unlinkSync(filePath())
  } catch (err) {
    if ((err.errno === -2) && (err.code === 'ENOENT')) return
    throw err
  }
}
function resetTestCaseData () {
  removeFile()
  resetFile()
}

function getDir () {
  return path.join(__dirname, './test_env')
}

function filePath () {
  return `${getDir()}/${studentId}.json`
}

function checkIfFileExits () {
  return fs.existsSync(filePath())
}

function getFileData () {
  return JSON.parse(fs.readFileSync(filePath()))
}

tape('cleanup', function (t) {
  resetTestCaseData()
  server.close()
  t.end()
})
