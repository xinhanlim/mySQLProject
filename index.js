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
    });

    app.post('/customers/create', async (req,res)=> {
        const {first_name, last_name, rating, company_id} = req.body
        const sql = `INSERT INTO Customers (first_name, last_name, rating, company_id)
VALUES(?,?,?,?);`
        const bindings = [first_name, last_name, rating, company_id];
        await connection.execute(sql,bindings)
        res.redirect('/customers');
        console.log(req.body);
    });

    app.get('/customers/:id/delete', async (req,res) => {
        const customer_id = req.params.id;
        const [rows] = await connection.execute(`SELECT * FROM Customers Where customer_id = ?`, [customer_id]);
        const customer = rows[0];
        res.render('customers/delete', {
            customer
        })
    });

    app.post('/customers/:id/delete', async (req,res) => {
        try{
            const customer_id = req.params.id;
            await connection.execute(`DELETE FROM Sales WHERE customer_id = ? `, [customer_id]);
            await connection.execute(`DELETE FROM EmployeeCustomer WHERE customer_id = ?`, [customer_id]);
            await connection.execute(`DELETE FROM Customers WHERE customer_id = ?`, [customer_id]);
            res.redirect('/customers');
        }catch(e){
            res.send("Unable to delete due to relationship. Try Again Later")
            console.log(e);
        };
    });

    app.get('/customers/:id/update', async (req,res) =>{
        const customer_id = req.params.id;
        const [rows] = await connection.execute(`SELECT * From Customers WHERE customer_id = ? `, [customer_id]);
        const [companies] = await connection.execute(`SELECT * From Companies`);
        res.render('customers/update', {
            customer: rows[0],
            companies
        });
    })

    app.post('/customers/:id/update', async (req,res) => {
        const customer_id = req.params.id;
        const {first_name, last_name, rating, company_id} = req.body;
        await connection.execute(`UPDATE Customers Set first_name=?, last_name=?, rating=?, company_id=? WHERE customer_id = ?`, [first_name,last_name, rating ,company_id, customer_id])
        res.redirect('/customers');
    })


    app.get('/employees', async (req,res) => {
        const [employees] = await connection.execute(
            `SELECT * FROM Employees JOIN Departments On Employees.department_id = Departments.department_id`)
        res.render('employees/index', {
            employees
        });
    });

    app.get('/employees/create', async (req,res) =>{
    const [departments] = await connection.execute(`SELECT * FROM Departments`);
    res.render('employees/create', {
        departments
    })
    });

    app.post('/employees/create', async (req,res) => {

        //const bindings = [req.body.fist_name, req.body.last_name, req.body.department_id];
        //await connection.execute(``INSERT INTO Employees (first_name,last_name, department_id) VALUES (?, ?, ?)`, bindings);
        const {first_name, last_name, department_id} = req.body
        const sql = `INSERT INTO Employees (first_name,last_name, department_id) VALUES (?, ?, ?)`;
        const bindings = [first_name, last_name, department_id];
        await connection.execute(sql,bindings);
        res.redirect('/employees');
        console.log(req.body);
    });
    
}
main();

app.listen(3300, ()=>{
    console.log('Express Server is running')
});