const { faker } = require('@faker-js/faker') 
const crypto = require('crypto') 

function generateMockProducts() {
    return {
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        dapartament: faker.commerce.department(),
        stock: parseInt(faker.string.numeric()),
        description: faker.commerce.productDescription(),
        id: faker.database.mongodbObjectId(),
        thumbnail: faker.image.url()
    }
}

const generateMockUsers = () => {
    // cuantos productos agregamos, limites '1' - '9'
    let numOfPorducts = parseInt(faker.string.numeric(1, {bannedDigits: ['0']})) //bannedDigits hace que no sea 0
    let proudcts = []
    for (let i = 0; i < numOfPorducts; i++) {
        proudcts.push(generateMockProducts())        
    }

    return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        sex: faker.person.sex(),
        birthDate: faker.date.birthdate(),
        phone: faker.phone.number(),
        image: faker.image.avatar(),
        id: faker.database.mongodbObjectId(),
        _id: crypto.randomUUID(),
        email: faker.internet.email(),
        proudcts
    }
}

module.exports = generateMockUsers;