import console from 'console'
import Collection from '../classes/Collection'
import wooApi from './wooApi'

import getProductYearByTitle from './getProductYearByTitle'

async function checkCollectionNovelties(collectionUrl: string): Promise<Array<Object>> {
	let novelties: Array<Object> = []
	
	let collectionInfo = await Collection.get(collectionUrl, true)
	console.log(`Checando ${collectionInfo.title} - ${collectionInfo.pagesNumber} páginas`)

	let existentProductsQuantityInARow = 0 // Used to predict 'end' of should-run
	for (let {title, hash, relativeUrl} of collectionInfo.albums) {
		let productInfo = (await wooApi.get('products', {sku: hash})).data

		if (productInfo.length === 0) {
			// O produto não existe
			novelties.push({
				title,
				hash,
				relativeUrl
			})

			console.log(`[!] NOVIDADE: ${title} - ${hash}`)
			existentProductsQuantityInARow = 0
		} else existentProductsQuantityInARow += 1

		if (existentProductsQuantityInARow >= 10) {
			console.log('10 existent products in a row - Quitting...')
			break;
		}
	}
	
	return novelties
}

export default checkCollectionNovelties