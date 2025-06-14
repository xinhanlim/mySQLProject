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

    app.get('/customers', async (req,res) => {
     let [customers] = await connection.execute(`SELECT * FROM Customers
    JOIN Companies ON Customers.company_id = Companies.company_id`)
     res.render("customers/index",{
        customers
     });
    });

    app.get('/customers/create',async (req,res) => {
        const [companies] = await connection.execute(`SELECT company_id, name FROM Companies`)
        res.render("customers/create", {
            companies
        })
    })

    app.post('/customers/create', async (req,res)=> {
        const {first_name, last_name, rating, company_id} = req.body
        const sql = `INSERT INTO Customers (first_name, last_name, rating, company_id)
VALUES(?,?,?,?);`
        const bindings = [first_name, last_name, rating, company_id];
        await connection.execute(sql,bindings)

        res.redirect('/customers');
        console.log(req.body);
    })
    
    
}
main();

app.listen(3300, ()=>{
    console.log('Express Server is running')
});