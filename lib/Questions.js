module.exports ={
    whatToDo:{
        type:"list",
        message:"What would you like to do?",
        choices:["View All Employee","View All Employees By Department","View All Employees By Manager","Add Employee","Remove Employee","Update Employee Role","View All Role","Add Role","Remove Role","View All Departments","Add Departments","View Total Utilized Budget By Department","Quit"],
        name:"userTodo"
    },
    addNewDep:{
        type:"input",
        message:"What is the name of the department?",
        name:"departName"
    },
    addNewRoleQ:(arr)=>[{
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
        choices: arr,
        name:"departmentChoose"
    }],
    removeRoleQ: (arr)=> [{
        type:"list",
        message:"Which role do you want to delete?",
        // choices: await getAllRoleTitle(),
        choices: arr,
        name:"deleteRole"
    },
    {
        type:"confirm",
        message:"Are you sure you want to delete?",
        name:"deleteConfirm"
    }],
    viewBudgetQ: (arr)=> [{
            type:"list",
            message:"Which department would you like to see Total Utilized Budget for?",
            choices: arr,
            name:"depChoose"
    }],
    viewEmpluByDepQ:(arr)=>[{
            type:"list",
            message:"Which department would you like to see employees for?",
            choices: arr,
            name:"emplyChoose"
        }],
    viewEmpluByDepQ:(arr)=>[{
            type:"list",
            message:"Which employees do you want to see direct reports for?",
            choices: arr,
            name:"emplyChoose"
        }],
    removeEmployQ:(arr)=>[{
            type:"list",
            message:"Which employee do you want to delete?",
            choices: arr,
            name:"deleteEmploy"
        },
        {
            type:"confirm",
            message:"Are you sure you want to delete?",
            name:"deleteConfirm"
        }],
    addNewEmpQ:(roleArr,empArr)=> [
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
            choices: roleArr,
            name:"empRole"
        },
        {
            type:"list",
            message:"Who is the employee's manager?",
            choices: empArr,
            name:"empManager"
        }],
    updateEmpRoleQ:(empArr,roleArr)=>[
        {
            type:"list",
            message:"Which employee's role do you want to update",
            choices: empArr,
            name:"updateEmp"
        },
        {
            type:"list",
            message:"Which role do you want to assign the selected employee?",
            choices: roleArr,
            name:"selectRole"
        }],
    quitQ:[{
        type:"confirm",
        message:"Are you sure you want to quit?",
        name:"quitConfirm"
    }]
}