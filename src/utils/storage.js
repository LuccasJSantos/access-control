import * as FileSystem from 'expo-file-system'

export default {
  async read(filename) {
    const directory = FileSystem.documentDirectory
    const filenameExt = `${filename}.json`

    return FileSystem.readAsStringAsync(
      `${directory}${filenameExt}`, 
      { encoding: FileSystem.EncodingType.UTF8 }
    ).then(data => JSON.parse(data))
  },

  async write(filename, data) {
    const directory = FileSystem.documentDirectory
    const filenameExt = `${filename}.json`
    const content = JSON.stringify(data)

    return FileSystem.writeAsStringAsync(
      `${directory}${filenameExt}`,
      content,
      { encoding: FileSystem.EncodingType.UTF8, }
    )
  }
}