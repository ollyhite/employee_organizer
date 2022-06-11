module.exports ={
    whatToDo:{
        type:"list",
        message:"What would you like to do?",
        choices:["View All Employee","View All Employees By Department","View All Employees By Manager","Add Employee","Remove Employee","Update Employee Role","Update Employee Manager","View All Role","Add Role","Remove Role","View All Departments","Add Departments","View Total Utilized Budget By Department","Quit"],
        name:"userTodo"
    },
    addNewDep:{
        type:"input",
        message:"What is the name of the department?",
        name:"departName"
    },
    removeEmployQ:[{
        type:"input",
        message:"Which employee do you want to delete?",
        name:"deleteEmploy"
    },
    {
        type:"confirm",
        message:"Are you sure you want to delete?",
        name:"deleteConfirm"
    }
    ],
    addNewRole:[{
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
        choices:["Sales Lead","Salesperson","Lead Engineer","Software Engineer","Account Manager","Accountant","Legal Team Lead","Lawyer"],
        name:"departmentChoose"
    }],
    addNewEmp:[
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
    ],
    updateEmpRole:[
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
    ],
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
}