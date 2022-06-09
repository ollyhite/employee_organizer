module.exports ={
    whatToDo:{
        type:"list",
        message:"What would you like to do?",
        choices:["View All Employee","Add Employee","Update Employee Role","View All Role","Add Role","View All Departments","Add Departments","Quit"],
        name:"userTodo"
    },
    addNewDep:{
        type:"input",
        message:"What is the name of the department?",
        name:"departName"
    },
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
    ]
}