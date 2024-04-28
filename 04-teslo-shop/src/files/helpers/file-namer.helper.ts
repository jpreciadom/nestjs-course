import {v4 as uuid} from 'uuid'

export const fileNamer = (
    _: Express.Request,
    file: Express.Multer.File,
    callback: Function
) => {
    const fileExtension = file.mimetype.split('/')[1];
    const fileName = `${uuid()}.${fileExtension}`

    return callback(null, fileName)
}
