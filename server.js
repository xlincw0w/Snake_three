const express = require('express')
const cors = require('cors')
const path = require('path')
const PORT = process.env.PORT || 3001

const app = express()

app.use(cors())
app.use(express.static(path.join(__dirname, 'dist')))

app.listen(PORT, function () {
    console.log('Server listenning !\n')
})
