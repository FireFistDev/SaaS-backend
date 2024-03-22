It is backed application created for sweeft digital acceleration program 

first of all you must to clone thats repository and then execute it on docker following command  "docker compose up"

there are endpoints  for work with thats saas application

1) Create a  new Company 

()Post
localhost:3000/auth/register/company

{
    "name":"myCompany",
    "email":"akaki7600@gmail.com",
    "passwordHash":"mypassword",
    "country":"mycountry",
    "industry": "Finance"
} - dummy Company

afther send request its automatically registered in database and send activation email on provided in  request body,
until you don't click activation link you cant login in your company account


2) Login Compnany interface 

()Post
localhost:3000/auth/login/company

{
    "email":"akaki7600@gmail.com",
    "password":"mypassword"
}

you should provide email and password for login in your company account

3) select compnay subscription plan 


PROTECTED BY JWT TOKEN
()Post
localhost:3000/company/select/subscription/FreeTier
Headers : {
    authorization : "Bearer `${token}`",
}
on thats route you should select your subscription plan in params end of endpoint which is privided in prisma.schema,



4) create user for compnay

PROTECTED BY JWT TOKEN 

()Post  
localhost:3000/company/createuser

Headers : {
    authorization : "Bearer `${token}`",
}

body : {
    "name":"workerName",
    "email": "akaki7200@gmail.com"
}

for create user in compnay you must to send user name and email to send activation link, after comformation it must to send his password  to complate registration



5) get all compmy users 

()Get
localhost:3000/company/getusers

Headers : {
    authorization : "Bearer `${token}`",
}


6) get all compmy files 

()Get
localhost:3000/company/getusers

Headers : {
    authorization : "Bearer `${token}`",
}


7) activate user 

PROTECTED BY JWT TOKEN 
@Post 
localhost:3000/auth/activate/user?token=`${token}`
{
    "passwordHash" : "newPassword"
}

you should send new password to activate user 


8) login user

@Post 
localhost:3000/auth/login/user

Body : {
    "email":"akaki720@gmail.com",
    "password" : "newPassword"
}
thats route returs JWT token for authentication on every page 


9) thats route  for user upload his file on compnay

@Post
localhost:3000/user/uploadfile

Headers : {
    authorization : "Bearer `${token}`",
}

body : {
    file : "'.csv', '.xls', '.xlsx' , '.pdf'"
    visibility : "Public" || Priviate" 
}

body : {
    file : "'.csv', '.xls', '.xlsx' , '.pdf'"
    visibility : "Priviate" 
    visibleForWorkers : 1
    visibleForWorkers : 2
}
on thats route you shoud upload your file with propery visibility there are two options public and private if you wanna to its was 
private send additional filed like a example 

10) change file visibility

@Post
localhost:3000/user/updatefile/`${fileId}`
Headers : {
    authorization : "Bearer `${token}`",
}
body : {
    visibility : "Public" 

}
thats route work like upload file route there you can change the visibility 


11) delete file 
@Delete
localhost:3000/user/deletefile/`${fileId}`
Headers : {
    authorization : "Bearer `${token}`",
}
thats route works l