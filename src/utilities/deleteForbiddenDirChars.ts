export default function deleteForbiddenDirChars(s: string): string {
    let forbiddenChars = ['<', '>', ':', '"', '/', '\\', '|', '?', '*']
    for (let char_ of forbiddenChars) {
        s = s.replace(new RegExp(`\\${char_}`, 'gi'), '')
    }
    return s
}