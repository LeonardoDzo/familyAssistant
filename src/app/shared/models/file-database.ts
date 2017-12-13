export class FileDatabase {
    downloadUrl: string
    thumbnail: string
    parent: string
    isFolder: boolean

    constructor(
    	public filename: string, 
    	public id: string, 
    	public type: string
    ) { }
}
