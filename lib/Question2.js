require('dotenv').config();
const mysql = require('mysql2');
const util = require('util');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log(`Connected to the employee_db database.`)
);
const query = util.promisify(db.query).bind(db);

const getAllRoleTitle = async() =>{
    try{
        const result = await query('SELECT title FROM role GROUP BY title');
        const titleArray = result.map((item)=>item.title);
        return titleArray;
    }catch(err){
    
    }
}

const whatToDoQ ={
        type:"list",
        message:"What would you like to do?",
        choices:["View All Employee","Add Employee","Update Employee Role","View All Role","Add Role","View All Departments","Add Departments","Quit"],
        name:"userTodo"
};

const addNewDepQ={
        type:"input",
        message:"What is the name of the department?",
        name:"departName"
    
}

const addNewRoleQ= [{
        type:"input",
        message:"What is the name of the role?",
        name:"roleName"
    },
    {
        type:"input",
        message:"What is the salary of the role?",
        name:"roleSalary"
    },{
        type:"list",
        message:"Which department dose the role belong to?",
        choices: getAllRoleTitle(),
        name:"departmentChoose"
    }]

const addNewEmpQ=[
        {
            type:"input",
            message:"What is the employee's first name?",
            name:"empFirstName"
        },
        {
            type:"input",
            message:"What is the employee's last name?",
            name:"empLastName"
        },
        {
            type:"list",
            message:"What is the employee's role?",
            name:"empRole"
        },
        {
            type:"list",
            message:"Who is the employee's manager?",
            name:"empManager"
        }
    ]

const updateEmpRoleQ=[
        {
            type:"list",
            message:"Which employee's role do you want to update",
            name:"updateEmp"
        },
        {
            type:"list",
            message:"Which role do you want to assign the selected employee?",
            name:"selectRole"
        },
    ]
module.exports = {whatToDoQ, addNewDepQ , addNewRoleQ, addNewEmpQ , updateEmpRoleQ};