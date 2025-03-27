import multer, {diskStorage} from "multer";
import { nanoid } from "nanoid";
import path from "path";
import fs from "fs";

export const fileValidation = {
    images:["image/jpg","image/png","image/jpeg"],
    files:["application/pdf"],
    videos:["video/mp4"],
    Audio:["audio/mpeg"]
}

export const upload = (fileType,folder) => {

    const storage = diskStorage({
        destination:(req,file,cb) => {

            const folderPath = path.resolve(".", `${folder}/${req.user._id}`)

            if(fs.existsSync(folderPath)) {
                return cb(null, folderPath);
            }
            else {
                fs.mkdirSync(folderPath,{recursive:true})
                const fileName = `${folder}/${req.user._id}`
                cb(null,fileName)
            }

            
        },

        filename:(req,file,cb) => {

        cb(null ,nanoid() + "_____" + file.originalname)
    }})

    const fileFilter = (req,file,cb) => {

        if(!fileType.includes(file.mimetype) )
            return cb(new Error("in-valid file type"), false)

        return cb(null ,true)
    }

    const multerUpload = multer({storage,fileFilter})

    return multerUpload
}