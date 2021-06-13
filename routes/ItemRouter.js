const express = require('express')
const router = express.Router()

var Busboy = require('busboy')
const fs = require('fs')
const { pipeline: pLine } = require('stream')
const util = require('util')
const pipeline = util.promisify(pLine)

const { authenticateToken } = require('../service/Auth')
// const { errorItemDoesNotExist } = require('../global/errors')
const validate = require('../lib/validation/validation')
const itemService = require('../service/Item')
const userService = require('../service/User')

async function getItem (req, res, next) {
  const item = await itemService.getItem(null, req.params.itemId)
  res.send(item)
}

async function searchItems (req, res, next) {
  const { page, limit, filter, coordinates, radius } = req.body.searchOptions
  const items = await itemService.getPaginated(
    page,
    limit,
    filter,
    coordinates,
    radius
  )
  res.send(items)
}

async function getItemsPage (req, res, next) {
  const { page, limit, filter, coordinates, radius } = req.body.searchOptions
  const items = await itemService.getPage(
    page,
    limit,
    filter,
    coordinates,
    radius
  )
  res.send(items)
}

async function addItem (req, res, next) {
  try {
    const userId = req.user.user
    const item = req.body

    const newItem = await userService.addNewItem(userId, item)
    return res.json(newItem)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

async function addItemImage (req, res, next) {
  var busboy = new Busboy({ headers: req.headers })
  let itemid = null
  let processImage = null

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    console.log('Start processing file ' + filename)

    processImage = new Promise((resolve, reject) => {
      // TODO Add Storage Provider logic here
      pipeline(file, fs.createWriteStream('./testfiles/' + filename)).then(() => {
        console.log('Uploaded Image to Storage Provider')
        console.log('Add imageId to Item', itemid)
        resolve('Sucessfully added new image to item')
      }).catch(error => reject(error))
    })
  })

  busboy.on('field', (fieldname, value) => {
    if (fieldname === 'itemid') itemid = value
  })

  busboy.on('finish', () => {
    console.log('Done parsing form!')

    processImage
      .then(result => {
        console.log('Finished processing file')
        res.send(result)
        res.end()
      })
      .catch(error => {
        console.log('Error processing file ', error)
      })
  })

  req.pipe(busboy)
}

async function updateItem (req, res, next) {
  try {
    const itemId = req.params.itemId
    const updateFields = req.body
    const item = await userService.updateItem(
      req.user.user,
      itemId,
      updateFields
    )
    res.json({ item })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

async function deleteItem (req, res, next) {
  try {
    const itemId = req.params.itemId
    await userService.deleteItem(req.user.user, itemId)
    return res.json({ id: itemId })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

router.get('/item/:itemId', getItem)
router.post('/item/', authenticateToken, validate('itemcreate'), addItem)
router.post('/image', authenticateToken, /* validate('itemimage'), */ addItemImage)
router.post('/paginated', searchItems)
router.post('/page', getItemsPage)
router.put('/item/:itemId', authenticateToken, updateItem)
router.delete('/item/:itemId', authenticateToken, deleteItem)

module.exports = router
