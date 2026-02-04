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