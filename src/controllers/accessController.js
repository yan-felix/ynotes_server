const crypto = require('crypto');
const validator = require('validator');
const PasswordValidator = require('password-validator');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SignUp = {
  generateRandomToken(length) {
    return crypto.randomBytes(length).toString('hex')+"INnAMaNudAToKkeN";
  },

  validateNameFormat(name){
    return !name || name.length < 3 ? false: true
  },

  validatePasswordFormat(password){
    const schema = new PasswordValidator();

    schema
      .is().min(6)            // Mínimo de 8 caracteres.
      .is().max(30)           // Máximo de 100 caracteres.
      .has().digits()         // Deve ter pelo menos um dígito.
      .has().letters()        // Deve ter pelo menos uma letra.
      .has().not().spaces()   // Não deve ter espaços.

    return schema.validate(password);
  },

  validateEmailFormt(email){
    return validator.isEmail(email);
  },

  async validateEmail(email){
    const existingEmail = await prisma.users.findUnique({
      where:{
        email: email.trim()
      }
    });

    return !existingEmail && SignUp.validateEmailFormt(email);
  },

  async validateSingUpInformations(name, email, password, confirm_password){
    const validateName = SignUp.validateNameFormat(name)
    const validateEmail = await SignUp.validateEmail(email)
    
    if(!validateName) return {validated: false, index: 1, type: "name_length", message: "O nome de usuário deve conter pelo menos 3 caracteres."}
    if(!validateEmail) return {validated: false, index: 2, type: "email", message: "E-mail inválido! O e-mail informado já está em uso ou não atende ao formato exigido: “****@***mail.com”."}
    if(!SignUp.validatePasswordFormat(password)) return {validated: false, index: 3, type: "pass_format", message: "Formato inválido! A senha deve conter pelo menos 6 caracteres, e ter pelo menos um letra e um número."}
    if(password != confirm_password) return {validated: false, index: 4, type: "pass_confirmation", message: "Ambas as senhas devem ser iguais!"}

    return {validated: true, message: "As informações fornecidas pelo usuálrio são válidas e posdem ser usadas na criação de uma nova conta!"}
  }
};

const Login = {
  generateRandomToken(length) {
    return crypto.randomBytes(length).toString('hex')+"INnAMaNudAToKkeN";
  },

  async validatedEmail(email){
    const user = await prisma.users.findUnique({
      where:{
        email: email
      }
    });

    return user ? true : false
  },

  async validatePassword(email, password){
    const user = await prisma.users.findUnique({
      where:{
        email: email
      }
    });

    return user && user.password === password
  },

  async validateLoginInformations(email, password){
    if(!(await Login.validatedEmail(email))) return {validated: false, index: 7, type: "not_found", message: "E-mail não encontrado. Por favor informe um e-mail válido."}
    if(!(await Login.validatePassword(email, password))) return {status: 401, validated: false, index: 8, type: "different_pass", message: "Senha inválida! A senha informada não corresponde à senha da conta solicitada. Por favor, tente novamente."}
    
    return {validated: true, message: "Usuário validado com sucesso!"}
  }
};

module.exports = {
  async signUp(req, res){
    const { name, email, password, confirmPassword } = req.body;
    
    if (!name || !email || !password || !confirmPassword) return res.status(400).json({validated: false, index: 1, type: "sing_up_empyt_camp", message: 'Preencha todos os campos!'});
    if (!(await (SignUp.validateSingUpInformations(name, email, password, confirmPassword))).validated) return res.status(401).json(await SignUp.validateSingUpInformations(name, email, password, confirmPassword));

    try{
      const token = SignUp.generateRandomToken(20);
      const user = await prisma.users.create({
        data: {
          token: token,
          email: email,
          name: name,
          password: password,
        },
      });

      return res.status(201).json({ created: true, userID: user.id, name: user.name, email: user.email, token: user.token, message: "Usuário criado com sucesso!"})
    }catch(error){
      console.log(error)
      return res.status(500).json({ message: "Erro interno ao criar usuário. (Path: server/src/controllers/singUp - linha: 83)", created: false, index: 5, type: "prisma_error"});
    }finally{
      await prisma.$disconnect()
    };
  },

  async login(req, res){
    const {email, password} = req.body;

    if (!email || !password) return res.status(400).json({ validated: false, index: 1, type: "login_empyt_camp", message: 'Preencha todos os campos!'});
    if(!(await Login.validateLoginInformations(email, password)).validated) return res.status(401).json( await Login.validateLoginInformations(email,password));

    try{
      const token = Login.generateRandomToken(20)
      const user = await prisma.users.update({
        where:{
          email: email.trim()
        },
        data:{
          token: token.trim()
        }
      });

      return res.status(200).json({ userID: user.id, name: user.name, email: user.email, token: user.token, message: "Bem-vindo!" });
    }catch(error){
      console.error('Erro ao acessar o banco de dados:', error);
      return res.status(500).json({ message: "Erro interno ao acessar o banco de dados. (Path: server/src/controllers/login - linha: 63).", validated: false, type: "prisma_error",  error});
    }finally{
      prisma.$disconnect()
    };
  },

  async authUser(req, res){
    const userID = req.headers['user-id'];
    const token = req.headers['token'];

    if(!userID || !token) return res.status(401).json({auth: false, index: 9, type: "auth_failed", message: "Error de altenticação, userID e/ou token em falta. Tente se altenticar novamente: logout --> login."});
    
    try{
        const user = await prisma.users.findFirst({
            where: {
                id: userID,
                token: token,
            },
        });

        return user && user.token != '' ? res.status(200).json({ auth: true, message: "auth successfully!" }) : res.status(403).json({ auth: false, message: "auth failed." });
    }catch(error){
        console.error('Erro ao acessar o banco de dados:', error);
        return res.status(500).json({ error: {message: "Erro interno ao acessar o banco de dados. (Path: server/src/api/auth - linha: 21).", validated: false, type: "prisma_error",  error} });      
    }finally{
        prisma.$disconnect()
    };
  },

  async logout(req, res){
    const userID = req.headers['user-id'];
    const token = req.headers['authorization'];
    
    try{
        await prisma.users.update({
            where:{
                id: userID,
                token: token 
            },
            data:{
                token: ''
            }
        });

        return res.status(200).json({ message: "Sessão encerrada com sucesso! Espero te ver novamente em breve :)"});
    }catch(error){
        return res.status(500).json({ error: {message: "Erro interno ao acessar o banco de dados. (Path: server/src/api/logout - linha: 13).", validated: false, type: "prisma_error",  error} });      
    }finally{
        await prisma.$disconnect()
    };
  },
};