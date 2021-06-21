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

const pipeline = util.promisify(pLine)

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
