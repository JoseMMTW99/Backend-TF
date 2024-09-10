const { Router } = require('express') 
const {fork} = require('child_process') 
const { sendEmail } = require('../../utils/sendMail.js') 
const { sendSms } = require('../../utils/sendSms.js') 
const generateMockUsers = require('../../utils/generateMocks.js')

const router = Router()

router.get('/users', (req, res) => {
    let users = []

    for (let i = 0; i < 10; i++) {
          users.push(generateMockUsers())      
    }

    res.send({
        status: 'success',
        payload: users
    })
})



module.exports = router;