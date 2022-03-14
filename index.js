const express = require("express");
const mysql = require("mysql2")
const cors = require('cors');

const router = express.Router()
const app = express();
const fs = require('fs');
app.use(express.urlencoded({ extended: false }))
const port = 3011;

const home = fs.readFileSync(`${__dirname}/html/home.html`,'utf-8');
const register = fs.readFileSync(`${__dirname}/html/register.html`,'utf-8');
const login = fs.readFileSync(`${__dirname}/html/index.html`,'utf-8');
const corsOptions = {
     //origin: 'http://localhost',
     origin: 'http://127.0.0.1:5500',
     credentials: true,
};
app.use(cors(corsOptions));


//Create connection database 
const db = mysql.createConnection({
     host: "127.0.0.1",
     user: "root",
     port: 3303,
     password: "123456za",
     database: "coffimadeshop",
});

// // Connect to db
db.connect((err) => {
     if (err) { err }
     console.log("MySql Connected");
});

router.get('/home', (req, res) => {
     res.send(home)
})

router.get('/index', (req, res) => {
     res.send(login)
})
router.get('/data_name', (req, res) => {
     let sql = "SELECT username FROM `coffimadeshop`.`user`;"
     db.query(sql, (error, results, fields) => {
          let message = ""
          message = "ข้อมูล"
          res.send({ error: false, data: results, message: message })
     })
})
router.get('/register', (req, res) => {
     res.send(register)
})

router.post('/register', (req, res) => {
     let username = req.body.username;
     let password = req.body.password;
     let gmail = req.body.gmail;
     let phoneNumber = req.body.phoneNumber;

     if (!username || !password || !gmail || !phoneNumber) {
          if (!username) {
               res.status(400).send({ error: true, message: "กรุณากรอก Username " })
          }
          else if (!password) {
               res.status(400).send({ error: true, message: "กรุณากรอก password" })
          }
          else if (!gmail) {
               res.status(400).send({ error: true, message: "กรุณากรอก gmail" })
          }
          else if (!phoneNumber) {
               res.status(400).send({ error: true, message: "กรุณากรอก phoneNumber" })
          }
     } else if (username.length < 8) {
          res.status(400).send({ error: true, message: "กรุณากรอก Username มากกว่า 8 ตัว" })
     } else if (password.search(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/)) {
          res.status(400).send({ error: true, message: "กรุณากรอก Password ให้ครบถ้วน (มากกว่า 8 ตัว และอักษร a-z , A-Z)" })
     } else if (gmail.search(/^(?=.*[@])/)) {
          res.status(400).send({ error: true, message: "กรุณากรอก Gmail ให้ถูกต้อง" })
     } else if (phoneNumber.search(/^(?=.*[0-9])(?!.*[!@#$%^&*])(?!.*[a-zA-Z])/) || phoneNumber.length != 10) {
          res.status(400).send({ error: true, message: "กรุณากรอก phoneNumber ให้ถูกต้อง( 0-9 )" })
     }
     else {
          let sql = "INSERT INTO user (username,password,gmail,phoneNumber) VALUES (?,?,?,?)"
          db.query(sql, [username, password, gmail, phoneNumber], (error, results, fields) => {
               if (error) throw error;
               res.status(201).send({ error: false, data: results, message: "Pharmacy successfully added." })
          })
     }
})

router.put('/user', (req, res) => {
     let userID = req.body.userID;
     let username = req.body.username;
     let password = req.body.password;
     let gmail = req.body.gmail;
     let phoneNumber = req.body.phoneNumber;
     if (!userID || !username || !password || !gmail || !phoneNumber) {
          res.status(400).send({ error: true, message: "Please provide userID,username,password,gmail,phoneNumber " })
     }
     if (!username) {
          res.status(400).send({ error: true, message: "กรุณากรอก Username " })
     }
     else if (!password) {
          res.status(400).send({ error: true, message: "กรุณากรอก password" })
     }
     else if (!gmail) {
          res.status(400).send({ error: true, message: "กรุณากรอก gmail" })
     }
     else if (!phoneNumber) {
          res.status(400).send({ error: true, message: "กรุณากรอก phoneNumber" })
     }
     else if (username.length < 8) {
          res.status(400).send({ error: true, message: "กรุณากรอก Username มากกว่า 8 ตัว" })
     } else if (password.search(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/)) {
          res.status(400).send({ error: true, message: "กรุณากรอก Password ให้ครบถ้วน (มากกว่า 8 ตัว และอักษร a-z , A-Z)" })
     } else if (gmail.search(/^(?=.*[@])/)) {
          res.status(400).send({ error: true, message: "กรุณากรอก Gmail ให้ถูกต้อง" })
     } else if (phoneNumber.search(/^(?=.*[0-9])(?!.*[!@#$%^&*])(?!.*[a-zA-Z])/) || phoneNumber.length != 10) {
          res.status(400).send({ error: true, message: "กรุณากรอก phoneNumber ให้ถูกต้อง( 0-9 )" })
     } else {
          let sql = "UPDATE user SET username =?, password =? ,gmail =?, phoneNumber=? WHERE userID =? "
          db.query(sql, [username, password, gmail, phoneNumber, userID], (error, results, fields) => {
               if (error) throw error;
               let message = ""
               if (results.changedRows === 0) {
                    message = " not found or data is same"
               } else {
                    message = "Successfully updated user data"
               }
               res.send({ error: false, data: results, message: message })
          })
     }
})

router.delete('/delete', (req, res) => {
     let userID = req.body.userID;
     if (!userID) {
          res.status(400).send({ error: true, message: "Please provide user id" })
     } else {
          let sql = "DELETE FROM user WHERE userID =? "
          db.query(sql, [userID], (error, results, fields) => {
               if (error) throw error;
               let message = ""
               if (results.affectedRows === 0) {
                    message = "User not found."
               } else {
                    message = "Successfully deleted user data."
               }
               res.status(202).send({ error: false, data: results, message: message })
          })
     }
})

app.use(router)
app.listen(port, () => {
     console.log(`Server running at http://localhost:${port}/`);
})