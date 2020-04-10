const { errorBadRequest } = require('../../global/errors')
const schemas = require('./schemas')

const Ajv = require('ajv')
const ajv = new Ajv({ allErrors: true })

const validators = {}
Object.keys(schemas).forEach(schema => (validators[schema] = ajv.compile(schemas[schema])))

function validate (schemaName) {
  return (req, res, next) => {
    const valid = validators[schemaName](req.body)
    if (valid) return next()
    next(errorBadRequest(validators[schemaName].errors))
  }
}

module.exports = validate
