import { error } from "console";
import express from "express";
import { promises as fs } from "fs";
import cors from "cors";

const { readFile, writeFile } = fs;

const router = express.Router();

router.post("/", async (req, res,next) => {
 
     try {
 let account = req.body;
  //validação
  if(!account.name || account.balance == null) {
    throw new Error('Name e Balance são obrigatorios')
  }
  
 const data = JSON.parse(await readFile('accounts.json'))
 //fazendo o parse de string para json JSON.parse(conteudo do data)
      
     account = {id:data.nextId++,
                name: account.name,
                balance:account.balance 
              }
     

   data.accounts.push(account)

   await writeFile(global.fileName,JSON.stringify(data))

  res.send(account); 
  logger.info(`POST /account - ${JSON.stringify(account)}`)
} 
  catch(err){
    next(err)
  }
 
});

router.get('/', async (req,res,next)=>{
  try {

    let account = req.body;
    const data = JSON.parse(await readFile(global.fileName))
     delete  data.nextId
      res.send(data)
      logger.info(`GET /account`)

    
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req,res,next)=>{
  try {

    const data = JSON.parse(await readFile(global.fileName))
    // conversão string para numeros parseInt 
    const account = data.accounts.find(account => account.id === parseInt(req.params.id) )
      res.send(account)
    logger.info(`GET /account/:id ${req.params.id} `)
    
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req,res,next)=>{
  try {

    const data = JSON.parse(await readFile(global.fileName))
    data.accounts = data.accounts.filter(account => account.id !== parseInt(req.params.id) )
      

      await writeFile(global.fileName,JSON.stringify(data))
     res.end()

     logger.info(`DELETE /account - ${req.params.id}`)
    
  } catch (err) {
    next(err)
  }
})

router.put("/:id", async (req, res,next) => {
 
  try {
const account = req.body;
//validation 
if(!account.name || account.balance == null) {
  throw new Error('Name e Balance são obrigatorios')
}

const data = JSON.parse(await readFile('accounts.json'))
//pegando o index do arq e comparando o recebido
const index = data.accounts.findIndex(a => a.id === account.id )

//validation
if(index === -1) {
  throw new Error("Registro não encontrado")
}
//fazendo a alteração do registro
data.accounts[index].name = account.name
data.accounts[index].balance = account.balance
   

await writeFile(global.fileName,JSON.stringify(data))

res.send(account);
logger.info(`PUT /account - ${JSON.stringify(account)}`)
} 
catch(err){
  next(err)
}

});

router.patch("/updatebalance", async (req, res,next) => {
 
  try {
let account = req.body;

 //validação
 if(!account.id || account.balance == null) {
  throw new Error('ID e Balance são obrigatorios')
}

const data = JSON.parse(await readFile('accounts.json'))
//pegando o index do arq e comparando o recebido
const index = data.accounts.findIndex(a => a.id === account.id )

//validation
if(index === -1) {
  throw new Error("Registro não encontrado")
}

//fazendo a substituição
data.accounts[index].balance = account.balance
   

await writeFile(global.fileName,JSON.stringify(data))

res.send(account);
logger.info(`PATCH /account/updatebalance - ${JSON.stringify(account)}`)
} 
catch(err){
  next(err)
}

});
//rota de erro
router.use((err,req,res,next)=> {
  global.logger.error(`${req.method} - ${req.baseUrl} - ${err.message}`) 
  
  res.status(400).send({
    error:err.message
})
})



export default router;