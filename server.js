const express=require("express")
const connect=require("./config/connectDB")
const cors=require("cors")
//instanciation 
const app=express()



require("dotenv").config();
// middleware 

app.use(express.json())
app.use(cors())

// connect to DB

connect();

// routes


app.use("/api/admin", require("./routes/admin") )
// app.use("/api/comments", require("./routes/comment") )
app.use("/api/users", require("./routes/user") )
// app.use("/api/user", require("./routes/d") )

 // port

const port=5000
app.listen(port, err=>{
    err ? console.log(err ): console.log(`server is running on port${port}`)
})