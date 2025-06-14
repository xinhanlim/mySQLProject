SELECT * FROM Customers
    JOIN Companies ON Customers.company_id = Companies.company_id

INSERT INTO Customers (first_name, last_name, rating, company_id)
VALUES("Jonie", "Surface", 3, 2);

SELECT * FROM Employees JOIN Departments On Employees.department_id = Departments.department_id;

INSERT INTO Employees (first_name,last_name, department_id) VALUES
("DONNIE", "DONKEY", 3);

DELETE FROM Customers WHERE customer_id = 5;

UPDATE Customers Set first_name="Jane", last_name="Marry", rating="2", company_id="1" WHERE customer_id = 2;