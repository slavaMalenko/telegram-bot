const TelegramApi = require('node-telegram-bot-api')

const token = '1869775039:AAFcVBB8WSsatBYKHTRRhs6-DNdG4b271Dk';

const bot = new TelegramApi(token, { polling: true });

const chats = {}

const gameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: '0', callback_data: '0' }],
            [{ text: '1', callback_data: '1' }, { text: '2', callback_data: '2' }, { text: '3', callback_data: '3' }],
            [{ text: '4', callback_data: '4' }, { text: '5', callback_data: '5' }, { text: '6', callback_data: '6' }],
            [{ text: '7', callback_data: '7' }, { text: '8', callback_data: '8' }, { text: '9', callback_data: '9' }],
        ]
    })
}

const againOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'Играть ещё раз', callback_data: '/again' }],
        ]
    })
}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Проверь свою интуицию!')
    await bot.sendMessage(chatId, 'Я загадал число от 0 до 9, если угадаешь - найдёшь завтра 3 рубля!')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Загадал!', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Начальное приветсвие' },
        { command: '/info', description: 'Информация о пользователе' },
        { command: '/game', description: 'Проверка интуиции' },
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        console.log(msg.text)
        if (text === '/start') {
            await bot.sendMessage(chatId, `Добро пожаловать, ${msg.from.first_name}!`)
            return bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/997/223/99722369-026f-3dd5-909f-bcb97c9cb923/192/1.webp')
        }

        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }

        if (text === '/game') {
            return startGame(chatId)
        }

        await bot.sendMessage(chatId, `Я такой тупой, что общаюсь только по командам, а команды ${msg.text} - нет :(`)
        return bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/997/223/99722369-026f-3dd5-909f-bcb97c9cb923/4.webp')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            return await startGame(chatId)
        }

        if (data == chats[chatId]) {
            await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}! Завтра жди 3 рубля`)
            return await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/997/223/99722369-026f-3dd5-909f-bcb97c9cb923/3.webp', againOptions)
        } else {
            await bot.sendMessage(chatId, `Ты со своим ${data} даже 3 рубля не найдёшь! Я загадал цифру ${chats[chatId]}`)
            return await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/997/223/99722369-026f-3dd5-909f-bcb97c9cb923/6.webp', againOptions)
        }
    })
}

start();