SELECT * FROM Customers
    JOIN Companies ON Customers.company_id = Companies.company_id

INSERT INTO Customers (first_name, last_name, rating, company_id)
VALUES("Jonie", "Surface", 3, 2);

SELECT * FROM Employees JOIN Departments On Employees.department_id = Departments.department_id;

INSERT INTO Employees (first_name,last_name, department_id) VALUES
("DONNIE", "DONKEY", 3);

DELETE FROM Customers WHERE customer_id = 5;