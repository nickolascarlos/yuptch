import fs from 'fs'
import path from 'path'

import Album from '../classes/Album'
import deleteForbiddenDirChars from './deleteForbiddenDirChars'
import downloadImage from './downloadImage'

async function albumImagesDownload(albumUrl: string, root: string): Promise<[string, boolean]> {
	let album: Album = await Album.get(albumUrl)
	let savePath = path.resolve(`${root}/${deleteForbiddenDirChars(album.hash)}`)

	let downloadedImages = 0
	function printProgress(image: string, error?: any) {
		downloadedImages += 1
		console.log(`[*] ${downloadedImages} de ${album.images.length} | ${album.title} - ${image} | ${!error ? `downloaded!` : `failed! ::: ${error.message}`}`)
	}

	let downloadTasks: Array<Promise<any>> = []
	for (let image of album.images) {
		let imageExtension = image.split('.')[image.split('.').length-1]
		let imageRoot = image.split('/').slice(0, 5).join('/') + '/' + 'big' + '.' + imageExtension
		let imageName = image.split('/')[image.split('/').length-2]

		downloadTasks.push(
				downloadImage('https:' + imageRoot, savePath, imageName)
					.then(() => printProgress(imageRoot))
					.catch((e) => printProgress(imageRoot, e))
			)
	}

	let allImagesDownloaded: boolean
	try {
		await Promise.all(downloadTasks)
		allImagesDownloaded = true
	} catch (e) {
		allImagesDownloaded = false
	}

	// Save metainfo
	try {
		fs.writeFileSync(savePath + '/meta.info', `${album.hash}~${album.title}~${album.images.length}~${album.mainImageId}`)
	} catch (e) {
		console.log(`[!] Erro com o meta.info :::`)
		console.log(e)
	}

	return [savePath, allImagesDownloaded]
}

export default albumImagesDownload