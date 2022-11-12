const express = require('express');
const router = express.Router();

router.get('/', async function(req, res){
    res.json('Opnião Política API');
});

router.get('/cpf/:cpf', async function(req, res){
    const test = await userService.getUser(req.params.cpf);
    res.json(test);
});

module.exports = router;