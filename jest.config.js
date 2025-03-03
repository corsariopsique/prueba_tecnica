// jest.config.js
module.exports = {
    preset: 'ts-jest',            
    testEnvironment: 'node',       
    roots: ['<rootDir>/tests'],  
    cache: false,  
    transform: {
      '^.+\\.tsx?$': 'ts-jest',     
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  };
  