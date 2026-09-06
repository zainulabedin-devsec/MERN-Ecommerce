const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        const conc = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB is connected :${conc.connection.host}`)
    }
    catch(error){
        console.error("DB connection lost")
        console.error(error.message)
        process.exit(1)
    }
}

module.exports = connectDB;