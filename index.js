const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

// dasturni tahlil qilish/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// ilovani jsonli tahlil qilish
app.use(bodyParser.json())

app.use(cors())

const UserRouter = require('./router/user_router')

<<<<<<< HEAD
app.use('/user',UserRouter)
const PORT = 8081;
app.listen(PORT, () => {
    console.log("server running");
});  
=======
app.use('/user',UsreRouter)

app.listen('8181',()=>{
    console.log('server running');
}) 
>>>>>>> 5e57d95 (man)
