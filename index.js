require('dotenv').config();
const inquirer = require("inquirer");
const questions = require("./lib/Questions");
const mysql = require('mysql2');
const util = require('util');
const cTable = require('console.table');
// const {whatToDoQ, addNewDepQ ,addNewRoleQ, addNewEmpQ,updateEmpRoleQ} = require('./lib/Question2');

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



const start = async() =>{
    const answer = await inquirer.prompt(questions.whatToDo);
            switch(answer.userTodo){
                case "View All Employee": await viewAllEmp();
                break;
                case "Add Employee": await addNewEmp();
                break;
                case "Update Employee Role": await updateEmpRole();
                break;
                case "View All Role": await viewAllRole();
                break;
                case "Add Role": await addNewRole();
                break;
                case "View All Departments": await viewAllDep();
                break;
                case "Add Departments": await addNewDep();
                break;
                case "Quit": quit();
                break;
            }
}



const viewAllEmp = async() =>{
    try{
        const viewAllEmp = await query('SELECT employee.id,employee.first_name,employee.last_name,role.title,department.department_name,role.salary,employee.manager_id FROM department JOIN role ON department.id = role.department_id join employee on role.id = employee.role_id;')
        console.table(viewAllEmp);
        start();
    }catch(err){
        console.log(err);
    }
}

const addNewEmp = async() =>{
    
}

const updateEmpRole = async() =>{
    
}

const viewAllRole = async() =>{
    try{
        const viewAllRole = await query('SELECT * FROM role')
        console.table(viewAllRole);
        start();
    }catch(err){
        console.log(err);
    }
}

const addNewRole = async () =>{
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
        choices: await getAllRoleTitle(),
        name:"departmentChoose"
    }]
    const answer = await inquirer.prompt(roleQuestion);
        const roleAnswerObj = {
            title: answer.roleName,
            salary: answer.roleSalary,
            department_name: answer.departmentChoose,
        }
        addRoleToDB(roleAnswerObj)
}

const addRoleToDB = async(roleAnswerObj)=>{
    try{
        const roleTitleAndId = await query('SELECT id,title FROM role GROUP BY id');
        const findId =roleTitleAndId.find((item => item.title === roleAnswerObj.department_name))
        const setToDB = await query(`INSERT INTO role(title,salary,department_id)
        VALUES ('${roleAnswerObj.title}', ${Number(roleAnswerObj.salary)},${findId.id});`);
        console.log(`Added ${roleAnswerObj.title} to the database`);
        const viewAllRole = await query('SELECT * FROM role')
        console.table(viewAllRole);
        start();
    }catch(err){
        console.log(err);
    }
}

const viewAllDep = async() =>{
    try{
        const viewAllDep = await query('SELECT * FROM department')
        console.table(viewAllDep);
        start();
    }catch(err){
        console.log(err);
    }
}

const addNewDep = async() =>{
    const answer = await inquirer.prompt(questions.addNewDep);
        // console.log(answer.departName);
    try{
        const setToDB = await query(`INSERT INTO department(department_name)
        VALUES('${answer.departName}')`)
        console.log(`Added ${answer.departName} to the database`);
        const viewAllDep = await query('SELECT * FROM department')
        console.table(viewAllDep);
        start();
    }catch(err){
        console.log(err)
    }
}


const quit = () =>{
    console.log("Bye!!!!!!!");
    return;
}


start();
