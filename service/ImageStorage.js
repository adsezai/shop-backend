const { BlobServiceClient } = require('@azure/storage-blob')

const ONE_MEGABYTE = 1024 * 1024
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 }

let blobServiceClient = null
let containerClient = null

function initializeImageStorage (azureConnectionString, azureContainerName) {
  try {
    console.log('Initialize Image Store Azure Blobstorage')
    blobServiceClient = BlobServiceClient.fromConnectionString(azureConnectionString)
    containerClient = blobServiceClient.getContainerClient(azureContainerName)
  } catch (error) {
    console.error('Could not initialize Azure BlobStorage')
  }
}

async function uploadImageToStorage (imageName, imageStream, contentType) {
  console.log(`Upload image ${imageName} to azure`)
  const blockBlobClient = containerClient.getBlockBlobClient(imageName)
  return blockBlobClient.uploadStream(imageStream, uploadOptions.bufferSize, uploadOptions.maxBuffers, { blobHTTPHeaders: { blobContentType: contentType } })
}

module.exports = {
  uploadImageToStorage,
  initializeImageStorage
}
