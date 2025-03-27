import mongoose from "mongoose";

const connnctDB = async ()=> {

    try {
    await mongoose.connect(process.env.DB_URI, {

        serverSelectionTimeoutMS: 5000
        
    });
    console.log("coonected to dataBase successfully")
    } catch (error) {
    console.log("error connected to DB",error);
    
    }
}

export default connnctDB;