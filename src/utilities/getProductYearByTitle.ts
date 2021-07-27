export default function getProductYearByTitle(title: string): Array<any> {

	let year: any = title.match(/[0-9]{2}\/[0-9]{2}/)
	if (!year)
		year = title.match(/[0-9]{4}/)

	if (year) {
		year = year[0]

		if (year!.includes('/')) {
			let s_years = year.split('/')
			return [s_years[0] < 22 ? "20" + s_years[0] : "19" + s_years[0], s_years[0] < 22 ? "20" + s_years[1] : "19" + s_years[1]]
		} else 
			return [year]
	}

	return []
}