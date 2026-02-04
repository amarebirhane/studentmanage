 Student Management System codebase itself (as defined in the 
schema.prisma
 role enum), there are 7 functional roles:

SUPER_ADMIN
ADMIN (School Admin)
TEACHER
STUDENT
PARENT
ACCOUNTANT
STAFF


Who creates the staff and accountant? In this system, the School Admin (or Super Admin) is responsible for creating and managing all staff members, including Accountants and general Staff.
How to create and make them functional? I've developed an 
implementation plan
 to add a unified User Management page for Admins, update the Sidebar for these roles, and create their respective Dashboards.


  researched the functions of the ACCOUNTANT and STAFF roles.

Accountants focus on financial management, fee structures, and reports.
Staff handles daily operations, student administration, and attendance.
I also found that the backend is currently missing the logic to provide dashboard data for these roles, which would cause an error when they log in. I've updated the implementation plan to include a fix for this. Please review the plan.