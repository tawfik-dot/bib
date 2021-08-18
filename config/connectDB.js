const mongoose=require("mongoose")



// const connectDB=()=>{
//     mongoose.connect(config.get("MONGOURI"),{ useNewUrlParser: true , useUnifiedTopology: true })
//     .then(()=>console.log("mongoose connected"))
//     .catch(err=> console.log(err))
   
// }


const connectDB= async()=>{ 

     try {
        await mongoose.connect(process.env.MONGOURI,{ useNewUrlParser: true ,useCreateIndex:true, useUnifiedTopology: true })
        console.log("mongoose connected")
         
     } catch (err) {
        console.log(err)
          
     }
  

   
}


module.exports=connectDB 