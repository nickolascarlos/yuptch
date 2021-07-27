import axios from "axios";
import fs from "fs";
import path from "path";

async function downloadImage(imageUrl: string, root: string, imageName: string): Promise<string> {
	let imageData = (await axios.get(imageUrl, {
										headers: {
											referer: imageUrl
										},
										responseType: 'arraybuffer',
										timeout: 45000
									})).data

	let imageExtension = imageUrl.split('.')[imageUrl.split('.').length-1]
	imageName += '.' + imageExtension

	if (!root.endsWith('/'))
		root += '/'
	let savePath = path.resolve(root + imageName)
	await fs.promises.mkdir(path.resolve(root), {recursive: true}) // Cria, recursivamente, os diretórios necessários

	fs.writeFileSync(savePath, imageData)

	return savePath
}

export default downloadImage
