const inquirer = require('inquirer');
require('dotenv').config();
const mysql = require('mysql2');

//list of commands for employeeTracker application
const commands = 
    [`View All Employees`, 
    `Add Employee`, 
    'Update Employee Role',
    'View All Roles',
    `Add Role`,
    `View All Departments`,
    `Add Department`,
    `Quit`
];



//main INSERT DB query for employeeTracker to add employee
function addEmployee(response)
{
  //obtains managers and thier id to put into employee table
  const sql = ` SELECT f.id, CONCAT(f.first_name, " ", f.last_name) AS manager FROM employee e  LEFT JOIN employee f ON e.manager_id=f.id WHERE f.first_name IS NOT NULL;`;
  db.query(sql, function (err, results) {
  const managers =[];
  for(let i = 0; i < results.length; i++)
  {
    managers.push({id:results[i].id,
                  manager:results[i].manager });
  }


  //convert employees manager into thier ID for insertion
  if(response.emp_manager.toString() === "None")
  {
    response.emp_manager = NULL;
  }
  else
  {
      for(let i = 0; i < managers.length; i++)
      {
        if(managers[i].manager === response.emp_manager.toString()){
         response.emp_manager = managers[i].id;
        }
    }
   }

   //convert role.title into role id for INSERT
   const sql2 = "SELECT role.title FROM role ORDER BY id;";
   db.query(sql2, function (err, results) {
     for(let i = 0; i < results.length; i++)
     {
       //once I find the index that relates to the choice the user made, I assign response.emp_role 
       if(results[i].title.toString() === response.emp_role){
        response.emp_role = i+1;
      
       }
     }

      //main insertion query
      const sql3 = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${response.first_name}", "${response.last_name}", ${response.emp_role}, ${response.emp_manager});`;
      db.query(sql3, function (err, results) {
        init();
  })})});
}

//main INSERT DB query for employeeTracker to update employee
function updateEmployee(response)
{
  //query to obtain employee id from response.eployee_name
  const sql = `SELECT e.id FROM employee e WHERE CONCAT(e.first_name, " ", e.last_name) ="${response.employee_name}";`;
  db.query(sql, function (err, results) {
    response.employee_name = parseInt(results[0].id);

    //query to obtain role id from response.eployee_role
    const sql2 = `SELECT r.id FROM role r WHERE r.title="${response.employee_role}";`;
    db.query(sql2, function (err, results) {
    response.employee_role =  parseInt(results[0].id);
      
      //main query to update employee role
      const sql3 = `UPDATE employee SET role_id = ${response.employee_role} WHERE employee.id = ${response.employee_name};`;
      db.query(sql3, function (err, results) {
      init();
      })
    })
  })

}

//main INSERT DB query for employeeTracker to add role
function addRole(response)
{
  //since response.role_department is not the same as as role department_id
  //obtain department name list to compare to response.role_department
  const deptData = "SELECT department.name FROM department ORDER BY id;";
  db.query(deptData, function (err, results) {
    for(let i = 0; i < results.length; i++)
    {
      //once I find the index that relates to the choice the user made, I assign response.role_department + 1 
      if(results[i].name.toString() === response.role_department){
        response.role_department = i+1;
      }
    }
    //Note: there is a query statement I can do to get the row and make this cleaner, but if no time then just leave it

    const sql = `INSERT INTO role (title, salary, department_id) VALUES ("${response.role_name}", "${response.role_salary}", "${response.role_department}")`;
    const queryOutput = db.query(sql, function (err, results) 
      {
        init();
      });
  });
     
}
//main INSERT DB query for employeeTracker to add department
function addDepartment(response)
{
      const sql = `INSERT INTO department (name) VALUES ("${response.department}")`;
      const queryOutput = db.query(sql, function (err, results) 
        {
          init();
        });
}


//main employeeTracker application
function employeeTracker(data) {
 
  // View All Employees
    if(data.command === commands[0])
    {
            const sql = `SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name AS department, CONCAT(f.first_name, " ", f.last_name) AS manager FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee f ON e.manager_id=f.id;`;
            const queryOutput = db.query(sql, function (err, results) {
                console.table(results);
                init();
              });
    }

    // Add Employee
    if(data.command === commands[1])
    {
    

      //obtain list of role title to use in inquire
      const sql = "SELECT role.title FROM role ORDER BY id;";
      db.query(sql, function (err, results) {
      //convert query list of department names into an array to feed into inquire
        const roles = [];
        for(let i = 0; i < results.length; i++)
        {
          roles.push(results[i].title);
          }
        const sql2 = `SELECT e.id, CONCAT(f.first_name, " ", f.last_name) AS manager FROM employee e  LEFT JOIN employee f ON e.manager_id=f.id WHERE f.first_name IS NOT NULL;`;
          db.query(sql2, function (err, results) {
          const managers =["None"];

          for(let i = 0; i < results.length; i++)
          {
            managers.push(results[i].manager);
          }
          inquirer
          .prompt([
          {
          type: 'input',
          name: 'first_name',
          message: `What is the employee's first name?`,
          },
          {
            type: 'input',
            name: 'last_name',
            message: `What is the employee's last name?`,
          },
          {
          type: 'list',
          name: 'emp_role',
          message: `What is the employee's role?`,
          choices: roles
          },
          {
            type: 'list',
            name: 'emp_manager',
            message: `Who is the employee's manager?`,
            choices: managers
          }
      ])
     .then((response) =>
    //call addEmployee to perform query to insert role into database
    addEmployee( response));
     })});
      
    }

  // Update Employee Role
  if(data.command === commands[2])
    {
      //get list of employees from DB for inquire
      const sql = `SELECT CONCAT(e.first_name, " ", e.last_name) AS employees FROM employee e ORDER BY id;`;
      db.query(sql, function (err, results) {
        const employees = [];
        for(let i = 0; i < results.length; i++)
        {
          employees.push(results[i].employees);
        }

        //get list of roles from DB for inquire
        const sql2 = "SELECT role.title FROM role ORDER BY id;";
        db.query(sql2, function (err, results) {
        const roles = [];
          for(let i = 0; i < results.length; i++)
          {
            roles.push(results[i].title);
          }
        inquirer
      .prompt([
       {
         type: 'list',
         name: 'employee_name',
         message: `Which employee's role do you want to update?`,
         choices: employees
       },
       {
        type: 'list',
        name: 'employee_role',
        message: `Which role do you want to assign the selected employee?`,
        choices: roles
       }
     ])
     .then((response) =>
     //call addRole to perform query to insert role into database
      updateEmployee( response));
      
        })
      });
      
    }

  //View All Roles
  if(data.command === commands[3])
    {
            const sql = "SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id;";
            db.query(sql, function (err, results) {
                console.table(results);
                init();
              });
    }
  //Add Role
  if( data.command === commands[4])
    {
      //obtain list of department names to use in inquire
      const sql = "SELECT department.name FROM department ORDER BY id;";
      db.query(sql, function (err, results) {
        //convert query list of department names into an array to feed into inquire
        const departments = [];
        for(let i = 0; i < results.length; i++)
        {
          departments.push(results[i].name);
        }
        inquirer
      .prompt([
       {
         type: 'input',
         name: 'role_name',
         message: `What is the name of the role?`,
       },
       {
        type: 'input',
        name: 'role_salary',
        message: `What is the salary of the role?`,
       },
       {
        type: 'list',
        name: 'role_department',
        message: `Which department does the role belong to?`,
        choices: departments
       }
     ])
     .then((response) =>
     //call addRole to perform query to insert role into database
     addRole( response));
      });
      

    }
  //View All Departments
  if(data.command === commands[5])
    {
            const sql = "SELECT * FROM department;";
            db.query(sql, function (err, results) {
                console.table(results);
                init();
              });
    }
  //Add Department
  if(data.command === commands[6])
    {
      inquirer
       .prompt([
        {
          type: 'input',
          name: 'department',
          message: `What is the name of the department?`
        }
      ])
      .then((response) =>
      addDepartment( response));
    }
  //Quit
  if(data.command === commands[7])
    {
    db.close();
     return;
    }
 }


 //initialize inquire for each command for employeeTracker application
function init() {
    inquirer
    .prompt([
        {
          type: 'list',
          name: 'command',
          message: `What would you like to do?`,
          choices: commands,
        }
    ])
    .then((response) =>
      employeeTracker( response));
  
}

// Connect to database
const db = mysql.createConnection(
    {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE
    },
    console.log(`Connected to the company_db database.`)
  );

db.connect(function(err){
    if(err){
        console.log(err);
    }
});
// Function call to initialize app
init();