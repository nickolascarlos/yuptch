import axios from 'axios';
import cheerio, { CheerioAPI } from 'cheerio';

const md5 = require('md5');

class Album {
	title: string
	hash: string
	url: {
		absolute: string,
		relative: string
	}
	mainImageId: string
	images: Array<string>
	isLink: boolean
	href?: string

	constructor(title: string, baseUrl: string, relativeUrl: string, mainImageId: string, imagesUrls: Array<string>, isLink: boolean, href?: string) {
		this.title = title
		this.hash = md5(title)
		this.url = {
			absolute: baseUrl + relativeUrl,
			relative: relativeUrl
		}
		this.mainImageId = mainImageId
		this.images = imagesUrls
		this.isLink = isLink
		this.href = href
	}

	static async get(albumUrl: string): Promise<Album> {
		let albumHTMLContent: string = (await axios.get(albumUrl)).data
		let $: CheerioAPI = cheerio.load(albumHTMLContent)
	
		let baseUrl: string = '//' + albumUrl.split('?')[0].split('/')[2] + '/'
		let albumTitle: string = $('div.showalbumheader__gallerydec h2 span.showalbumheader__gallerytitle').text()
		let mainImageId: string = $('div.showalbumheader__gallerycover img').attr('src')?.split('/')[4]!
		let imagesUrls: Array<string> = $(`div.showalbum__parent.showalbum__nor.nor
											div.showalbum__children.image__main
											div.image__imagewrap
											img`)
										.map((_, img) => $(img).attr('data-origin-src'))
										.toArray() // É estranho, mas é assim mesmo, com esse .get() no final :/
		
		let [albumIsALink, albumHref] = await isAlbumALink($)
	
		return new Album(
							albumTitle,
							baseUrl,
							albumUrl.split('?')[0].split('/').slice(3).join('/') + '/',
							mainImageId,
							imagesUrls,
							albumIsALink,
							albumHref
						)
	}

}

async function isAlbumALink($: CheerioAPI): Promise<[boolean, string]> {

	let href: string | undefined = $('div.showalbumheader__gallerysubtitle.htmlwrap__main a').attr('href')
	
	let isCollection = href?.includes('/collections/') ? true : false
	return [
			isCollection,
			isCollection ? href! : ''
		]
}

export default Album;