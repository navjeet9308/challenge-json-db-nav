const fs = require('fs');
const path = require('path');
const _set = require('lodash.set');
const _has = require('lodash.has');
const _get = require('lodash.get');
const _unset = require('lodash.unset');
module.exports = {
  updateStudentProperties: async (properties, data, studentId) => {
    const filePath = module.exports.getFilePath(studentId);
    try {
      let student = await module.exports.getStudentFileContent(studentId);
      _set(student, properties, data);
      await module.exports.writeFileJson(filePath, student);
    } catch (error) {
      console.log('Error while updating student properties.');
      throw error;
    }
  },
  getStudentProperties: async (properties, studentId) => {
    try {
      let student = await module.exports.getStudentFileContent(studentId);
      if (_has(student, properties)) {
        return _get(student, properties);
      }
      return false;
    } catch (error) {
      console.log('Error while reading student properties.');
    }
  },
  deleteStudentProperties : async(properties, studentId) => {
    const filePath = module.exports.getFilePath(studentId);
    try {
      let student = await module.exports.getStudentFileContent(studentId);
      if (_has(student, properties)) {
        _unset(student, properties);
        await module.exports.writeFileJson(filePath, student);
        return true;
      }
      return false;
    } catch (error) {
      console.log('Error while deleting student properties.');
    }
  }, 
  getStudentFileContent : async  (studentId) => {
    try {
      const filePath = module.exports.getFilePath(studentId);
      return await module.exports.checkFileIfExits(filePath) ? 
        await module.exports.readFileJson(filePath)
        : 
        {};
    }catch (error) {
      console.log('Error while reading user file.');
      throw error;
    }
  },
   // return promise to be used with await to check if file exits.
  checkFileIfExits : (filePath) => {
    return new Promise(async(resolve) => {
      fs.access(filePath, fs.F_OK, (err) => {
        if (err) {
          resolve(false);
        }
        resolve(true);
      })
    });  
  },
  // read given file and parse the content to json.
  readFileJson : (filePath) => {
    return new Promise(async (resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) reject(false);
        resolve(JSON.parse(data));
      });
    });
  },
  // write json object to given file after converting to json string.
  writeFileJson : (filePath, content) => {
    return new Promise(async(resolve) => {
      fs.writeFile(filePath,JSON.stringify(content, null, 2), 'utf8' , (err) => {
        if(err) resolve(false);
        resolve(true);
      });
    });
  },
  // get file path from studentId
  getFilePath : (studentId) => {
    const filesDirectoryName = process.env.DB_DIR || 'db';
    return path.join(__dirname, '../../', `${filesDirectoryName}/${studentId}.json`);
  }
}