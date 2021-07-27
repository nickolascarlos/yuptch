import cheerio from "cheerio";
import axios from "axios";
import fs from "fs";

import Collection from "./classes/Collection";
import wooApi from './utilities/wooApi';
import checkCollectionNovelties from "./utilities/checkCollectionNovelties";
import albumImagesDownload from "./utilities/albumImagesDownload";
import path from "path/posix";
import getProductYearByTitle from "./utilities/getProductYearByTitle";

(async () => {

	let collectionsToAnalyze = [
		{
			title: 'Brasileirão',
			url: 'https://minkang.x.yupoo.com/collections/680738'
		},
		{
			title: 'Bundesliga',
			url: 'https://minkang.x.yupoo.com/collections/680725'	
		},
		{
			title: 'Itália Série A',
			url: 'https://minkang.x.yupoo.com/collections/708736'	
		},
		{
			title: 'Premiere League',
			url: 'https://minkang.x.yupoo.com/collections/680719'	
		},
		{
			title: 'França League 1',
			url: 'https://minkang.x.yupoo.com/collections/2897018'
		},
		{
			title: 'La Liga',
			url: 'https://minkang.x.yupoo.com/collections/680717'
		},
		{
			title: 'Japan League',
			url: 'https://minkang.x.yupoo.com/collections/2827820'
		},
		{
			title: 'Seleções',
			url: 'https://minkang.x.yupoo.com/collections/3118456'
		},
		{
			title: 'MLS',
			url: 'https://minkang.x.yupoo.com/collections/3247384'
		},
		{
			title: 'Eredivisie',
			url: 'https://minkang.x.yupoo.com/collections/3302916'
		},
		{
			title: 'Liga MX',
			url: 'https://minkang.x.yupoo.com/collections/3302917'
		},
		{
			title: 'SAF',
			url: 'https://minkang.x.yupoo.com/collections/3302915'
		},
		{
			title: 'Primeira Liga',
			url: 'https://minkang.x.yupoo.com/collections/3302977'
		}
	]

	let novelties: any = []
	for (let collection of collectionsToAnalyze) {
		console.log(`Collection: ${collection.title} | ${collection.url}`)
		try {
			novelties.push(...await checkCollectionNovelties(collection.url))
		} catch(e) {
			console.log('ERRO! ::: ' + e.message)
		}
		
	}

	let file = fs.openSync(path.resolve('./noveltiesList.txt'), 'w+')
	for (let novelty of novelties) {
		fs.writeSync(file, 'https://minkang.x.yupoo.com' + novelty.relativeUrl + '\n')
	}
	fs.closeSync(file)

	for (let n = 0; n < novelties.length; n++) {
		let novelty = novelties[n]
		console.log(`${n+1} de ${novelties.length}`)
		let productYear = getProductYearByTitle(novelty.title)
		try {
			await albumImagesDownload('https://minkang.x.yupoo.com' + novelty.relativeUrl,`./downloads/novelties/${productYear[productYear.length-1] === '2022' ? 'actual' : 'maybe'}`)
		} catch (e) {
			console.log(`NÃO FOI POSSÍVEL BAIXAR O ÁLBUM ${n+1} ::: ${e.message}`)
		}
	}

	console.log(novelties)

	// try {
	// await albumImagesDownload('https://minkang.x.yupoo.com/albums/96145133?uid=1&isSubCate=false&referrercate=680717', './downloads/')
	// 	console.log('Yay!')
	// } catch(e) {
	// 	console.log('Duh :/ ::: ' + e.message)
	// }
	

	return //

	let toCheckCollections = [
		'https://minkang.x.yupoo.com/collections/680717',
		'http://minkang.x.yupoo.com/collections/680725',
		'https://minkang.x.yupoo.com/collections/680738',
		'https://minkang.x.yupoo.com/albums/14188165',
		'http://minkang.x.yupoo.com/collections/2897018',
		'https://minkang.x.yupoo.com/albums/14188190',
	]

	for (let collection of toCheckCollections)
		await checkCollectionNovelties(collection)
	
	return 

	const urlContent: string = (await axios.get('https://minkang.x.yupoo.com/')).data
	const $ = cheerio.load(urlContent)

	// let album: Album = await getAlbum('https://minkang.x.yupoo.com/albums/94463807?uid=1&isSubCate=false&referrercate=664377')
	// let album: Album = await Album.get('https://minkang.x.yupoo.com/albums/98683619?uid=1&isSubCate=false&referrercate=680738')
	let collection: Collection = await Collection.get('https://minkang.x.yupoo.com/collections/680738')
	console.log(collection)
	console.log('====================')

	await collection.loadPages(true)
	console.log(collection)

	// $(`div.show-layout-category__catewrap`).each((i, el) => {
	// 	$(el).find(`a.album__main`).each((j, el2) => {
	// 		console.log(`https://minkang.x.yupoo.com${$(el2).attr('href')}`)
	// 	})
	// })

})();

