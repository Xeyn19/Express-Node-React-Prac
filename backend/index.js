import express from 'express'
import router from './route.js'
import cors from 'cors'; 


const app = express()
const PORT = 8000

app.use(cors()); 
app.use(express.json());



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/api', router)
app.use('/user', router)


app.listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
})
