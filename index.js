const express = require("express");
const mysql = require("mysql2")
const cors = require('cors');

const router = express.Router()
const app = express();
app.use(express.urlencoded({ extended: false }))
const port = 3011;

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
     password: "markdb01",
     database: "coffimadeshop",
});

// // Connect to db
db.connect((err) => {
     if (err) { err }
     console.log("MySql Connected");
});

router.get('/', (req, res) => {
     res.send({
          error: false,
          message: "Welcom to RESTful API Coffiemade with NodeJS.",
          writen_by: "thanakhan"
     })
})

router.get('/user', (req, res) => {
     db.query('SELECT * FROM user', (error, results, fields) => {
          if (error) throw error;
          let message = ""
          if (results === undefined || results.length == 0) {
               message = "pharmacy table is empty"
          } else {
               message = "Successfuly retrieved all user"
          }
          res.send({ error: false, data: results, massage: message })
     })
})

router.post('/user', (req, res) => {
     let username = req.body.username;
     let password = req.body.password;
     let gmail = req.body.gmail;
     let phoneNumber = req.body.phoneNumber;
     if (!username || !password || !gmail || !phoneNumber) {
          res.status(400).send({ error: true, message: "Please provide username,password,phonenumber" })
     } else {
          let sql = "INSERT INTO user (username,password,gmail,phoneNumber) VALUES (?,?,?,?)"
          db.query(sql, [username,password,gmail,phoneNumber], (error, results, fields) => {
               if (error) throw error;
               res.send({ error: false, data: results, message: "Pharmacy successfully added." })
          })
     }
})

router.get('/user/:id', (req, res) => {
     let id = req.params.id;
     if (!id) {
          res.status(400).send({ error: true, message: "Please provide user id." })
     } else {
          let sql = "SELECT * FROM user where userID = ?"
          db.query(sql, id, (error, results, fields) => {
               let message = ""
               if (results === undefined || results.length == 0) {
                    message = "user not found"
                    res.send({ error: false, data: results, message: message })
               } else {
                    message = "Successfully retieved user data"
                    res.send({ error: false, data: results[0], message: message })
               }

          })
     }
})

router.put('/user', (req, res) => {
     let userID = req.body.userID;
     let username = req.body.username;
     let password = req.body.password;
     let gmail = req.body.gmail;
     let phoneNumber = req.body.phoneNumber
     
     if (!userID || !username || !password || !gmail ||!phoneNumber ) {
          res.status(400).send({ error: true, message: "Please provide idPharmacy,PharmacyName,PharmacyType,Price " })
     } else {
          let sql = "UPDATE user SET username =?, password =? ,gmail =?, phoneNumber WHERE userID =? "
          db.query(sql, [username,password,gmail,phoneNumber,userID], (error, results, fields) => {
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
          let sql = "DELETE FROM user WHERE user_ID =? "
          db.query(sql, [userID], (error, results, fields) => {
               if (error) throw error;
               let message = ""
               if (results.affectedRows === 0) {
                    message = "User not found."
               } else {
                    message = "Successfully deleted user data."
               }
               res.send({ error: false, data: results, message: message })
          })
     }
})

app.use(router)
app.listen(port, () => {
     console.log(`Server running at http://localhost:${port}/`);
})