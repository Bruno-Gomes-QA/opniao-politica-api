const express = require('express');
const router = express.Router();

async function ValidateCpf(cpf) {

    let puppeteer
    let chromium
    let options
    console.log('init')
    if (process.env.AWS_LAMBDA) {
        chromium = require("chrome-aws-lambda");
        puppeteer = require("puppeteer-core");
    } else {
        puppeteer = require("puppeteer");
    }
    if (process.env.AWS_LAMBDA) {
        options = {
            args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
            defaultViewport: chromium.defaultViewport,  
            executablePath: await chromium.executablePath,
            headless: true,
            ignoreHTTPSErrors: true,
        };
    }
    console.log('init - 2')
  const browser = await puppeteer.launch(options)
  console.log('init - 3')
  const page = await browser.newPage();
  console.log('google open')
  const inputCpf = '#SE_NomeTituloCPF'
  const result = '#return-form-situacao-eleitoral > p:nth-child(2)'
  
  await page.goto('https://www.tse.jus.br/eleitor/titulo-e-local-de-votacao/copy_of_consulta-por-nome');
  await page.waitForSelector(inputCpf)
  await page.type(inputCpf, cpf, {delay:100})
  await page.waitForSelector(inputCpf)
  await page.keyboard.press('Enter')
  await page.waitForSelector(result)
  const situacao = await page.evaluate(() => {
      return document.querySelector('#return-form-situacao-eleitoral > p:nth-child(2)').textContent
  })
  console.log(`consulta realizada${situacao}`)
    await browser.close()
    return situacao
    
};

router.get('/', async function(req, res){
    res.json('Opnião Política API');
});

router.get('/cpf/:cpf', async function(req, res){
    const situacao = await ValidateCpf(req.params.cpf)
    res.json(situacao);
});

module.exports = router;