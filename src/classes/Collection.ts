import axios from "axios"
import cheerio, { CheerioAPI } from "cheerio"

const md5 = require('md5')

type albumInfo = {
	title: string,
	hash: string,
	relativeUrl: string
}

class Collection {
	
	title:           	   string
	url:             	   string
	pagesNumber:     	   number
	albums:          	   Array<albumInfo> = []
	pagesLoaded:     	   Array<number> = []
	allPagesLoaded:  	   boolean = false
	loadedAlbumsNumber:    number

	static async get(collectionUrl: string, pagesToLoad: true | Array<number> = []): Promise<Collection> {

		let collectionHTMLContent: string = (await axios.get(collectionUrl, {timeout: 45000})).data
		let $: CheerioAPI = cheerio.load(collectionHTMLContent)

		let collectionTitle: string = $('div.text_overflow.showheader__menuslink.showheader__currentcate a').eq(0).text()
		let collectionPagesNumber: number = parseInt($('form.pagination__jumpwrap span').eq(0).text().match(/([0-9])+/i)?.[0] || '1')
		let {content, pagesLoaded} = await this.loadCollectionPages(collectionUrl, pagesToLoad, collectionPagesNumber, collectionHTMLContent)

		return new Collection(
			collectionTitle,
			collectionUrl,
			collectionPagesNumber,
			content,
			content.length,
			pagesLoaded,
			Array.from(
				Array(collectionPagesNumber).keys()
			).every(page => pagesLoaded.includes(page+1))
		)
	}

	constructor(title: string, url: string, pagesNumber: number, albums: Array<albumInfo> = [], loadedAlbumsNumber: number, pagesLoaded: Array<number> = [], allPagesLoaded: boolean = false) {
		this.title = title
		this.url = url
		this.pagesNumber = pagesNumber
		this.albums = albums
		this.loadedAlbumsNumber = loadedAlbumsNumber
		this.pagesLoaded = pagesLoaded
		this.allPagesLoaded = allPagesLoaded
	}

	public async loadPages(pagesToLoad: true | Array<number>) {
		let collectionPagesContent: Array<albumInfo> = []
		let pagesLoaded: Array<number> = []

		let pagesInfo = await Collection.loadCollectionPages(this.url, pagesToLoad, this.pagesNumber)
		collectionPagesContent = pagesInfo.content
		pagesLoaded = pagesInfo.pagesLoaded

		this.albums = [...this.albums, ...collectionPagesContent]
		this.pagesLoaded = Array.from(new Set([...this.pagesLoaded, ...pagesLoaded])) // Just to avoid the duplicates
		this.allPagesLoaded = Array.from(Array(this.pagesNumber).keys()).every(page => pagesLoaded.includes(page+1))
		this.loadedAlbumsNumber = this.albums.length
	}

	private static async loadCollectionPages(baseUrl: string, pagesToLoad: true | Array<number>, collectionPagesNumber: number, firstCollectionPageContent?: string): Promise<{content: Array<albumInfo>, pagesLoaded: Array<number>}> {
		let collectionPagesContent: Array<albumInfo> = []
		let pagesLoaded: Array<number> = []
		
		if (pagesToLoad === true)
			pagesToLoad = Array.from(Array(collectionPagesNumber+1).keys()).slice(1)

		for (let page of pagesToLoad) {
			let collectionPageHTMLContent: string = (page === 1 && firstCollectionPageContent) ? firstCollectionPageContent : (await axios.get(baseUrl + '?page=' + (page).toString())).data
			let collectionPageContent = await this.getCollectionPageContent(collectionPageHTMLContent)
			
			if (collectionPageContent) {
				collectionPagesContent.push(...collectionPageContent)
				pagesLoaded.push(page)
			}
		}

		return ({
			content: collectionPagesContent,
			pagesLoaded: pagesLoaded
		})
	}

	private static async getCollectionPageContent(collectionPageHTMLContent: string) {
		let $: CheerioAPI = cheerio.load(collectionPageHTMLContent)
		
		let pageContent = $('div.showindex__parent div.showindex__children')
		.map((i, item) => ({
			title: $(item).find('a.album__main').attr('title')!,
			hash: md5($(item).find('a.album__main').attr('title')) as string,
			relativeUrl: $(item).find('a.album__main').attr('href')!
		}))
		.toArray()

		return pageContent.length > 0 ? pageContent : []
	}

}

export default Collection