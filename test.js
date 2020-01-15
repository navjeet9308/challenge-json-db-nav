const tape = require('tape')
const jsonist = require('jsonist')
const fs = require('fs')
const path = require('path')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const server = require('./server')

const endpoint = `http://localhost:${port}`
const studentId = 'nav9308'
const studentInfo = {
  "courses": {
    "english": {
      "quizzes": {
        "ye0ab62": {
          "score": 95
        }
      }
    }
  }
};

tape('PUT /:studentId/properties add property to studend Info', async function (t) {
  const url = `${endpoint}/${studentId}/personalInfo`
  const data = {
    name: 'Navjeet singh',
    register_no: 'uj98kh8_hdhfn89_yuba3d'
  }
  
  resetTestCaseData();
  
  jsonist.put(url, data, (err, body, res) => {
    let updatedStudent
    if (err) t.error(err)
    t.equal(res.statusCode, 200, 'http response code should be 200.')
    updatedStudent = getFileData();
    t.deepEqual(updatedStudent.personalInfo, data, 'Personal info should be equal.');
    t.end()
  })

})

tape('PUT /:studentId/:propertyName/properties checked nested properties', async function (t) {
  const url = `${endpoint}/${studentId}/test1/test2/test3`
  const data = {
    test5: "test6"
  }

  resetTestCaseData()

  jsonist.put(url, data, (err, body, res) => {
    let updatedStudent
    if (err) t.error(err)
    t.equal(res.statusCode, 200, 'http response code should be 200.')
    updatedStudent = getFileData()
    t.deepEqual(updatedStudent.test1.test2.test3, data, 'deep object test success.')
    t.end()
  })
})
tape('PUT /:studentId/properties create new file for student if does not exits', async function (t) {
  const url = `${endpoint}/${studentId}/info`
  const data = {
    mars: 'is red'
  }

  removeFile();

  jsonist.put(url, data, (err) => {
    if (err) t.error(err)
    t.ok(checkIfFileExits(), 'File created if not present.')
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
  // Create the directory if needed.
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
  resetFile();
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
  server.close()
  t.end()
})
