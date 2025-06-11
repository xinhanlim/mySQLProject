const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
require('dotenv').config();
const mysql = require('mysql2/promise');
let app = express();
app.set('view engine', 'hbs');
app.use(express.urlencoded
    ({extened:true})
);

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

const helpers = require('handlebars-helpers');
helpers({
    'handlebars': hbs.handlebars
})

async function main(){
    connection = await mysql.createConnection({
        'host' : process.env.DB_HOST,
        'user' : process.env.DB_USER,
        'database': process.env.DB_NAME,
        'password': process.env.DB_PASSWORD
    })
    
    app.get('/', (req,res) => {
        res.send('Hello, World!');
    });
    
}
main();

app.listen(3300, ()=>{
    console.log('Express Server is running')
});