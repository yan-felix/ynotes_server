const { PrismaClient } = require('@prisma/client');

const PasswordValidator = require('password-validator');
const validator = require('validator');
const prisma = new PrismaClient();

function validatePasswordFormat(password){
    const schema = new PasswordValidator();

    schema
      .is().min(6)            // Mínimo de 8 caracteres.
      .is().max(30)           // Máximo de 100 caracteres.
      .has().digits()         // Deve ter pelo menos um dígito.
      .has().letters()        // Deve ter pelo menos uma letra.
      .has().not().spaces()   // Não deve ter espaços.

    return schema.validate(password);
};

function validateEmailFormt(email){
    return validator.isEmail(email);
}

module.exports = {
    async changeAccountName(req, res){
        const id = req.headers['user-id'];
        const token = req.headers['token'];
        const {newName, confirmName, password } = req.body;

        try{
            if(!newName || newName.length < 3) return res.status(401).json({validSize:false, seted: false, index: 6, type: 'string_size', message: "O nome de usuário deve possuir pelo menos 3 caracteres (letras e/ou números)!"});
            if(newName != confirmName) return res.status(401).json({validSize:false, seted: false, index: 9, type: 'different_name', message: "Ambos os campos devem ser iguais!"});
            
            const user = await prisma.users.findUnique({
                where: {
                    id: id,
                    token: token
                }, 
                select:{
                    password: true,
                    name: true
                }
            });
            const oldName = user.name

            if(password == user.password){
                await prisma.users.update({
                    where: {
                        id: id,
                        token: token
                    },
                    data:{
                        name: newName
                    }
                });

                return res.status(200).json({ seted: true, oldName: oldName, message: "Nome configurado com sucesso!"});
            }else{
                return res.status(401).json({ seted: false, type: "different_pass", message: "Senha incorreta! Revise os caracteres e tente novamente."}); 
            };
        }catch(error){
            return res.status(500).json({ error: {message: "Error interno ao configurar o nome de usuário. (Path: server/src/controllers/singUp - linha 107)", seted: false, index: 5, type: "prisma_error", error}});
        }finally{
            await prisma.$disconnect()
        };
    },

    async changeAccountEmail(req, res){
        const id = req.headers['user-id'];
        const token = req.headers['token'];
        const {newEmail, confirmEmail, password } = req.body;

        try{
            if(!newEmail || !validateEmailFormt(newEmail)) return res.status(401).json({ validSize:false, seted: false, index: 2, type: 'email', message: "E-mail inválido! O e-mail informado já está em uso ou não atende ao formato exigido: “****@***mail.com”."});
            if(newEmail != confirmEmail) return res.status(401).json({confirm:false, seted: false, index: 9, type: 'different_email', message: "Ambos os campos devem ser iguais!"});

            const user = await prisma.users.findUnique({
                where: {
                    id: id,
                    token: token
                }, 
                select:{
                    password: true,
                    email: true
                }
            });

            const oldEmail = user.email

            if(password == user.password){
                await prisma.users.update({
                    where: {
                        id: id,
                        token: token
                    },
                    data:{
                        email: newEmail
                    }
                });

                return res.status(200).json({ seted: true, oldEmail: oldEmail, message: "E-mail configurado com sucesso!"});
            }else{
                return res.status(401).json({ seted: false, type: "different_pass", message: "Senha incorreta! Revise os caracteres e tente novamente."});  
            };
        }catch(error){
            return res.status(500).json({ error: {message: "Error interno ao configurar o nome de usuário. (Path: server/src/controllers/singUp - linha 107)", seted: false, index: 5, type: "prisma_error", error}});
        }finally{
            await prisma.$disconnect()
        };
    },
    
    async changeAccountPassword(req, res){
        const id = req.headers['user-id'];
        const token = req.headers['token'];
        const { newPassword, confirmPassword, password } = req.body;

        try{
            if(!newPassword || !validatePasswordFormat(newPassword) || password === newPassword) return res.status(401).json({validSize:false, seted: false, index: 3, type: 'pass_format', message: "Formato de senha inválido! A senha deve conter pelo menos 6 caracteres, e ter pelo menos um letra e um número. E deve ser DIFERENTE da antiga."});
            if(newPassword != confirmPassword) return res.status(401).json({confirm:false, seted: false, index: 9, type: 'different_format', message: "Ambos os campos devem ser iguais!"});

            const user = await prisma.users.findUnique({
                where: {
                    id: id,
                    token: token
                }, 
                select:{
                    password: true,
                }
            });

            if(password == user.password){
                await prisma.users.update({
                    where: {
                        id: id,
                        token: token
                    },
                    data:{
                        password: newPassword
                    }
                });

                return res.status(200).json({ seted: true, message: "Nome configurado com sucesso!"});
            }else{
                return res.status(401).json({ seted: false, type: "different_pass", message: "Senha incorreta! Revise os caracteres e tente novamente."})
                
            };
        }catch(error){
            return res.status(500).json({ error: {message: "Error interno ao configurar o nome de usuário. (Path: server/src/controllers/singUp - linha 107)", seted: false, index: 5, type: "prisma_error", error}});
        }finally{
            await prisma.$disconnect();
        };
    },

    async deleteAccount(req, res){
        const id = req.headers['user-id'];
        const token = req.headers['token'];
        const { email, password, confirmPassword } = req.body;
    
        //console.log({ email, password, confirmPassword })

        try{
            if(!id || !token) return res.status(401).json({auth: false, message: "Falha na autenticação! Tente se autenticar novamente: logout -> login"});
            if(!email) return res.status(401).json({validated: false, index: 8, type: "string_size", message: "Por favor, informe o e-mail da conta."})
            if(!password) return res.status(401).json({validated: false, index: 8, type: "different_pass", message: "Por favor, informe a senha da conta."})
            if(password != confirmPassword) return res.status(401).json({validated: false, index: 4, type: "pass_confirmation", message: "Ambas as senhas devem ser iguais!"})

            const user = await prisma.users.findUnique({
                where: {
                    id: id
                }, 
                select:{
                    email: true,
                    password: true
                }
            });

            if(email == user.email && password == user.password){
                await prisma.notes.deleteMany({
                    where: {
                        userID: id
                    }
                });

                await prisma.users.deleteMany({
                    where: {
                        id: id
                    }
                });

                return res.send(200) 
            }else{
                return res.status(401).json({validated: false, index: 8, type: "different_infos", message: "E-mail ou senha inválido(a). Por favor, revise as informações e tente novamente."})
            }
        }catch(error){
            return res.status(500).json({ error: {message: "Error interno ao configurar o nome de usuário. (Path: server/src/controllers/singUp - linha 225)", seted: false, index: 5, type: "prisma_error", error}});
        }finally{
            await prisma.$disconnect();
        };

    },
};