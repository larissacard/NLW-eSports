import  express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { ConverHourStringToMinutes } from './utils/convert-hour-string-to-minutes'; 
import { ConverMinutesToHourStrings } from './utils/convert-minutes-to-hour-strings';

const app = express()

app.use(express.json())
app.use (cors())


const prisma = new PrismaClient({
    log:['query']
})

//localhost:3333/ads

app.get('/games', async (request, response) => {
    const games = await prisma.game.findMany({
        include: {
            _count: {
                select: {
                    Ad: true,  
                }
            }
        }
    });

    return response.json(games);
});

app.post('/games/:id/ads', async (request, response) => {
    const gameId = request.params.id;
    const body: any = request.body;

    const ad = await prisma.ad.create({ 
        data:{
            gameId,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hourStart: ConverHourStringToMinutes(body.hourStart),
            hourEnd: ConverHourStringToMinutes(body.hourEnd ),
            useVoiceChannel: body.useVoiceChannel
        }
    })

    return response.status(201).json(ad);
})

app.get('/games/:id/ads', async (request, response) => {
    const gameId = request.params.id;

    const ads = await prisma.ad.findMany({
        select: {
            id: true,
            name: true,
            weekDays: true,
            game: true,
            hourEnd: true,
            hourStart: true,
            useVoiceChannel: true,
            yearsPlaying: true,
        },
        where:{
            gameId,
        },
        orderBy: {
            createdAt: 'desc',
        }
    })

    return response.json(ads.map(ad =>{
        return{
            ...ad,
            weekDays: ad.weekDays.split(","),
            hourStart: ConverMinutesToHourStrings(ad.hourStart),
            hourEnd: ConverMinutesToHourStrings(ad.hourEnd)
        }
    }))
}); 

app.get('/ads/:id/discord', async (request, response) => {
    const adId = request.params.id;

    const ad = await prisma.ad.findUniqueOrThrow({
        select: {
            discord: true,
        },
        where: {
            id: adId,
        }
    })
     
     return response.json({
        discord: ad.discord,
     })
})

app.listen(3333)