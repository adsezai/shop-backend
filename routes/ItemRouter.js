const express = require('express')
const router = express.Router()
var Busboy = require('busboy')
const uuid = require('uuid')
const { pipeline: pLine } = require('stream')
const util = require('util')

const { authenticateToken } = require('../service/Auth')
// const { errorItemDoesNotExist } = require('../global/errors')
const validate = require('../lib/validation/validation')
const itemService = require('../service/Item')
const userService = require('../service/User')
const { uploadImageToStorage } = require('../service/ImageStorage')
const { errorNoImageWasAddedToImageStorage } = require('../global/errors')
const { sendJsonNext } = require('../lib/api/util')

const pipeline = util.promisify(pLine)

async function getItem (req) {
  const item = await itemService.getItem(null, req.params.itemId)

  return item
}

async function searchItems (req) {
  const { page, limit, filter, coordinates, radius } = req.body.searchOptions

  const items = await itemService.getPaginated(
    page,
    limit,
    filter,
    coordinates,
    radius
  )
  return items
}

async function getItemsPage (req) {
  const { page, limit, filter, coordinates, radius } = req.body.searchOptions

  const items = await itemService.getPage(
    page,
    limit,
    filter,
    coordinates,
    radius
  )
  return items
}

async function addItem (req, res, next) {
  const userId = req.user.user
  const item = req.body

  const newItem = await userService.addNewItem(userId, item)

  return newItem
}

async function uploadImage (imageId, file, mimetype) {
  try {
    const result = await uploadImageToStorage(imageId, file, mimetype)
    console.log('Uploaded Image to Storage Provider.')
    return result
  } catch (error) {
    console.log('Error uploading Images to Storage Provider.', error.message)
  }
}

function reorderImageUrls (firstImage, imageUrls) {
  const index = imageUrls.findIndex(imageId => imageId === firstImage)

  return index > -1
    ? [firstImage, ...imageUrls.filter(id => id !== firstImage)]
    : imageUrls
}

async function addItemImage (req, res, next) {
  var busboy = new Busboy({ headers: req.headers })
  const { itemid } = req.query

  const addedImageIds = []
  let fileCount = 0
  let finishedAllFiles, thumbnailFile

  busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
    const imageId = uuid.v4()
    console.log('Start processing file ', imageId)
    if (fileCount === 0 && !thumbnailFile) thumbnailFile = imageId
    fileCount++
    // TODO if single image an this throws error
    const result = await uploadImage(imageId, file, mimetype)
    result && addedImageIds.push(imageId)
    if (--fileCount === 0 && finishedAllFiles === true) {
      try {
        console.log('Sucessfully added images.', addedImageIds)
        // TODO rollback item from DB
        addedImageIds || errorNoImageWasAddedToImageStorage()
        const orderedImageUrls = reorderImageUrls(thumbnailFile, addedImageIds)
        const item = await userService.updateItem(req.user.user, itemid, { imageUrls: orderedImageUrls })
        res.status(200).json(item)
      } catch (error) {
        console.log('Error adding images', error)
        res.status(error.code).send(error.message)
      }
    }
  })

  busboy.on('finish', async () => {
    finishedAllFiles = true
  })

  await pipeline(req, busboy).catch(error => {
    console.log('Error adding images', error)
    res.status(error.code).send(error.message)
  })
}

async function updateItem (req) {
  const itemId = req.params.itemId
  const updateFields = req.body

  const item = await userService.updateItem(
    req.user.user,
    itemId,
    updateFields
  )

  return { item }
}

async function deleteItem (req) {
  const itemId = req.params.itemId

  await userService.deleteItem(req.user.user, itemId)

  return { id: itemId }
}

const wrap = fn => (req, res, next) => sendJsonNext(res, next, fn(req))

router.post('/item/', authenticateToken, validate('itemcreate'), wrap(req => addItem(req)))
router.get('/item/:itemId', wrap(req => getItem(req)))
router.put('/item/:itemId', authenticateToken, wrap(req => updateItem(req)))
router.delete('/item/:itemId', authenticateToken, wrap(req => deleteItem(req)))
router.post('/paginated', wrap(req => searchItems(req)))
router.post('/page', wrap(req => getItemsPage(req)))
router.post('/image', authenticateToken, /* validate('itemimage'), */ addItemImage)

module.exports = router
