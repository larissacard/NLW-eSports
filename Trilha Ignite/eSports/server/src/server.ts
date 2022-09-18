import  express from 'express';

const app = express()

app.get('/ads', (request, response) => {
    return response.json([
        {id: 1, name: 'anuncio 01'},
        {id: 2, name: 'anuncio 02'},
        {id: 3, name: 'anuncio 03'},
        {id: 4, name: 'anuncio 04'}
        
        
    ])
})

app.listen(3333)