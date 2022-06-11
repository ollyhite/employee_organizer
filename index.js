require('dotenv').config();
const inquirer = require("inquirer");
const questions = require("./lib/Questions");
const mysql = require('mysql2');
const util = require('util');
const cTable = require('console.table');
var figlet = require('figlet');

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
        console.log(err);
    }
}

const getAllEmployName = async(type) =>{
    try{
        const result = await query('SELECT first_name,last_name FROM employee GROUP BY first_name,last_name');
        const employNameArr = result.map((item)=>item.first_name+" "+item.last_name);
        // console.log(employNameArr);
        if(type === "addNewEmp"){
            employNameArr.unshift("Null")
        }
        return employNameArr;
    }catch(err){
        console.log(err);
    }
}

const getAllDepName = async() =>{
    try{
        const result = await query('SELECT id,department_name FROM department GROUP BY id ORDER BY id;');
        const depNameArr = result.map((item)=>item.department_name);
        return depNameArr;
    }catch(err){
        console.log(err);
    }
}

const roleTitleAndId = async(comparedTitle)=>{
    try{
        const roleTitleAndIdArr = await query('SELECT id,title FROM role GROUP BY id');
        return roleTitleAndIdArr.find((item => item.title === comparedTitle))
        // return findId;
    }catch(err){
        console.log(err);
    }
}


const start = async() =>{
    try{
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
                case "View All Employees By Department":await viewEmplyByDep();
                break;
                case "View All Employees By Manager":await viewEmplyByMan();
                break;
                case "Remove Employee":await removeEmploy();
                break;
                case "Remove Role":await removeRole();
                break;
                case "View Total Utilized Budget By Department": await viewBudget();
                case "Quit": quit();
                break;
            }
    }catch(err){
        console.log(err);
    }
    
}

const removeRole = async()=>{
    try{
        const choicesArr = await getAllRoleTitle();
        const answer = await inquirer.prompt(questions.removeRoleQ(choicesArr));
        if(answer.deleteConfirm===true){
            const roleTitleAndId = await query('SELECT id,title FROM role GROUP BY id');
            const findId = roleTitleAndId.find((item => item.title === answer.deleteRole))
            await query(`DELETE FROM role WHERE id = ?`, findId.id);
            viewAllRole();
        }else{
            start();
        }
    }catch(err){
        console.log(err)
    }
}

const viewBudget = async()=>{
    try{
        const choicesArr = await getAllDepName();
        choicesArr.unshift("All");
        const answer = await inquirer.prompt(questions.viewBudgetQ(choicesArr));
        if(answer.depChoose==="All"){
            const viewAllDepBudgetTable = await query('SELECT department.id, department.department_name, SUM(role.salary) AS `utilized_budget` From department JOIN role on role.department_id = department.id JOIN employee on role.id = employee.role_id GROUP BY role.department_id;');
            console.table(viewAllDepBudgetTable);
            start();
        }else{
            const result = await query('SELECT id,department_name FROM department GROUP BY id ORDER BY id;');
            const findDepId = result.find((item => item.department_name === answer.depChoose))
            const viewEmplyByDepTable = await query(`SELECT department.id, department.department_name, SUM(role.salary) AS "utilized_budget" From department JOIN role on role.department_id = department.id JOIN employee on role.id = employee.role_id WHERE department_id =${findDepId.id} GROUP BY role.department_id;`);
            console.table(viewEmplyByDepTable);
            start();
        }
    }catch(err){
        console.log(err);
    }
}

const viewEmplyByDep = async()=>{
    const viewEmpluByDepQ ={
            type:"list",
            message:"Which department would you like to see employees for?",
            choices: await getAllDepName(),
            name:"emplyChoose"
        };

    try{
        const answer = await inquirer.prompt(viewEmpluByDepQ);
        const result = await query('SELECT id,department_name FROM department GROUP BY id ORDER BY id;');
        const findDepId = result.find((item => item.department_name === answer.emplyChoose))
        const viewEmplyByDepTable = await query(`SELECT employee.id,employee.first_name,employee.last_name,role.title FROM department JOIN role ON department.id = role.department_id join employee on role.id = employee.role_id WHERE department_id = ${findDepId.id} ORDER BY employee.id;`);
        console.table(viewEmplyByDepTable);
        start();
    }catch(err){
        console.log(err);
    }
}

const viewEmplyByMan = async () =>{
    const viewEmpluByDepQ ={
            type:"list",
            message:"Which employees do you want to see direct reports for?",
            choices: await getAllEmployName(),
            name:"emplyChoose"
        };

    try{
        const answer = await inquirer.prompt(viewEmpluByDepQ);
        const result = await query('SELECT id,first_name,last_name,manager_id FROM employee GROUP BY id ORDER BY id;');
        const findEmplyInfo = result.find((item => item.first_name+" "+item.last_name === answer.emplyChoose))
        if(findEmplyInfo.manager_id){
            const viewEmplyByManTable = await query(`SELECT employee.id,employee.first_name,employee.last_name,department.department_name,role.title FROM department JOIN role ON department.id = role.department_id join employee on role.id = employee.role_id WHERE employee.id = ${findEmplyInfo.manager_id} ORDER BY employee.id;`);
            console.table(viewEmplyByManTable);
        }else{
            console.log('This selected emplotee has no direct reports');
        }
        start();
    }catch(err){
        console.log(err);
    }
}

const removeEmploy = async ()=>{
    const removeEmployQ=[{
        type:"list",
        message:"Which employee do you want to delete?",
        choices: await getAllEmployName(),
        name:"deleteEmploy"
    },
    {
        type:"confirm",
        message:"Are you sure you want to delete?",
        name:"deleteConfirm"
    }];

    try{
        const answer = await inquirer.prompt(removeEmployQ);
        // console.log(answer);
        if(answer.deleteConfirm===true){
            const emplyNameAndId = await query('SELECT id,first_name,last_name FROM employee GROUP BY id');
            const findEmployId =emplyNameAndId.find((item => item.first_name+" "+item.last_name === answer.deleteEmploy))
            // console.log(findEmployId);
            await query(`DELETE FROM employee WHERE id = ?`, findEmployId.id);
            viewAllEmp();
        }else{
            start();
        }
    }catch(err){
        console.log(err)
    }
}


const viewAllEmp = async() =>{
    try{
        const viewAllEmpQ = await query('SELECT e.id AS "ID",e.first_name AS "First_Name",e.last_name AS "Last_Name",r.title AS "Title",d.department_name AS "Department",r.salary AS "Salary",e.manager_id AS "Manager" FROM department AS d JOIN role AS r ON d.id = r.department_id JOIN employee AS e on r.id = e.role_id ORDER BY e.id;')
        viewAllEmpQ.map((employee)=>{
            if(employee.Manager){
                const findEmployName =viewAllEmpQ.find((item => item.ID === employee.Manager))
                return employee.Manager = findEmployName.First_Name+" "+findEmployName.Last_Name;
            }
        })
        console.table(viewAllEmpQ);
        start();
    }catch(err){
        console.log(err);
    }
}


const addNewEmp = async() =>{
    const employeeQ = [
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
            choices: await getAllRoleTitle(),
            name:"empRole"
        },
        {
            type:"list",
            message:"Who is the employee's manager?",
            choices: await getAllEmployName("addNewEmp"),
            name:"empManager"
        }];

    try{
        const answer = await inquirer.prompt(employeeQ);
        const emplAnswerObj = {
            first_name: answer.empFirstName,
            last_name: answer.empLastName,
            role: answer.empRole,
            manager: answer.empManager,
        }
        addEmployToDB(emplAnswerObj);
    }catch(err){
        console.log(err);
    }
}

const addEmployToDB = async(emplAnswerObj) =>{
    // console.log("emplAnswerObj",emplAnswerObj);
    try{
        const roleTitleAndId = await query('SELECT id,title FROM role GROUP BY id');
        const findId = roleTitleAndId.find((item => item.title === emplAnswerObj.role))
        // const findId = roleTitleAndId(emplAnswerObj.role);
        // console.log(findId);
        const emplyNameAndId = await query('SELECT id,first_name,last_name FROM employee GROUP BY id');
        const findEmployId =emplyNameAndId.find((item => item.first_name+" "+item.last_name === emplAnswerObj.manager))
        const setToDB = await query(`INSERT INTO employee(first_name,last_name,role_id,manager_id) VALUES ('${emplAnswerObj.first_name}', '${emplAnswerObj.last_name}',${findId.id},${emplAnswerObj.manager==="Null"?"Null":findEmployId.id});`);
        console.log(`Added ${emplAnswerObj.first_name + " " +emplAnswerObj.last_name} to the database`);
        viewAllEmp();
    }catch(err){
        console.log(err);
    }
}

const updateEmpRole = async() =>{
    const updateEmpRoleQ=[
        {
            type:"list",
            message:"Which employee's role do you want to update",
            choices: await getAllEmployName("updateEmpRole"),
            name:"updateEmp"
        },
        {
            type:"list",
            message:"Which role do you want to assign the selected employee?",
            choices: await getAllRoleTitle(),
            name:"selectRole"
        }];

    try{
        const answer = await inquirer.prompt(updateEmpRoleQ);
        const emplRoleAnswerObj = {
            updateEmp: answer.updateEmp,
            selectRole: answer.selectRole,
        }
        updateEmpRoleToDB(emplRoleAnswerObj);
    }catch(err){
        console.log(err);
    }
}

const updateEmpRoleToDB = async(emplRoleAnswerObj)=>{
    try{
        const name = emplRoleAnswerObj.updateEmp.trim().split(/\s+/)
        const roleTitleAndId = await query('SELECT id,title FROM role GROUP BY id');
        const findId = roleTitleAndId.find((item => item.title === emplRoleAnswerObj.selectRole))
        // const findId = roleTitleAndId(emplRoleAnswerObj.selectRole);
        // console.log(findId);
        const setToDB = await query(`INSERT INTO employee(first_name,last_name,role_id)
        VALUES ('${name[0]}', '${name[1]}',${findId.id});`);
        console.log(`Updated ${emplRoleAnswerObj.updateEmp} to the database`);
        viewAllEmp();
    }catch(err){
        console.log(err);
    }
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
    }];

    try{
        const answer = await inquirer.prompt(addNewRoleQ);
        const roleAnswerObj = {
            title: answer.roleName,
            salary: answer.roleSalary,
            department_name: answer.departmentChoose,
        }
        addRoleToDB(roleAnswerObj)
    }catch(err){
        console.log(err);
    }
}

const addRoleToDB = async(roleAnswerObj)=>{
    try{
        const roleTitleAndId = await query('SELECT id,title FROM role GROUP BY id');
        const findId =roleTitleAndId.find((item => item.title === roleAnswerObj.department_name))
        // const findId = roleTitleAndId(roleAnswerObj.department_name);
        // console.log(findId);
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
    try{
        const answer = await inquirer.prompt(questions.addNewDep);
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
    figlet.text('GoodBye!!', {
    font: 'Ghost',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 200,
    whitespaceBreak: true
}, function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data);
});

    return;
}


figlet('Employee \n Organizer', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
});

setTimeout(() => {
    start();
}, 500)

