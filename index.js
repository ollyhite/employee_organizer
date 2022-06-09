const inquirer = require("inquirer");
const questions = require("./lib/Questions");
const mysql = require('mysql2');
const cTable = require('console.table');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'ollyhite',
        database: 'employee_db'
        // user: process.env.DB_USER,
        // password: process.env.DB_PASSWORD,
        // database: process.env.DB_NAME
    },
    console.log(`Connected to the employee_db database.`)
);
let titleArray;
const getAllRoleTitle = () =>{
    db.query('SELECT title FROM role GROUP BY title',function(err,result){
        // console.log(err);
        // console.log(result);
        titleArray = result.map((item)=>item.title)
        console.log("titleArray",titleArray);
        console.log(typeof titleArray);
        return titleArray;
    });
}

const roleQuestion =[{
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
        choices: titleArray,
        name:"departmentChoose"
    }]



const start = () =>{
    inquirer.prompt(questions.whatToDo).then((answer) =>{
            console.log("user want to do",answer);
            switch(answer.userTodo){
                case "View All Employee": viewAllEmp();
                break;
                case "Add Employee": addNewEmp();
                break;
                case "Update Employee Role": updateEmpRole();
                break;
                case "View All Role": viewAllRole();
                break;
                case "Add Role": addNewRole();
                break;
                case "View All Departments": viewAllDep();
                break;
                case "Add Departments": addNewDep();
                break;
                case "Quit": quit();
                break;
            }
        })
}



const viewAllEmp = () =>{
    db.query('SELECT employee.id,employee.first_name,employee.last_name,role.title,department.department_name,role.salary,employee.manager_id FROM department JOIN role ON department.id = role.department_id join employee on role.id = employee.role_id;',function(err,result){
        // console.log(result);
        console.table(result);
        start();
    });
}

const addNewEmp = () =>{
    
}

const updateEmpRole = () =>{
    
}

const viewAllRole = () =>{
    db.query('SELECT * FROM role',function(err,result){
        // console.log(result);
        console.table(result);
        start();
    });
}

const addNewRole = () =>{
    inquirer.prompt(roleQuestion).then((answer) =>{
        const roleAnswerObj = {
            roleName: answer.roleName,
            roleSalary: answer.roleSalary,
            departmentChoose: answer.departmentChoose,
        }
        console.log("roleAnswerObj",roleAnswerObj);
        // db.query(`INSERT INTO department(department_name)
        // VALUES('${answer.roleName}')`,function(err,result){
        //     err ? console.log(err):
        //         // console.log(result);
        //         console.log(`Added ${answer.roleName} to the database`);
        //         start();
        //         });
    });
}

const viewAllDep = () =>{
    db.query('SELECT * FROM department',function(err,result){
        // console.log(result);
        console.table(result);
        start();
    });
}

const addNewDep = () =>{
    inquirer.prompt(questions.addNewDep).then((answer) =>{
        console.log(answer.departName);
        db.query(`INSERT INTO department(department_name)
        VALUES('${answer.departName}')`,function(err,result){
            err ? console.log(err):
                // console.log(result);
                console.log(`Added ${answer.departName} to the database`);
                start();
                });
    });
}


const quit = () =>{
    console.log("Bye!!!!!!!");
    return;
}


getAllRoleTitle()
start();
